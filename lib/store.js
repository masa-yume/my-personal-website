import fs from "fs/promises";
import path from "path";
import { normalizeProfile } from "./profile";

const filePath = path.join(process.cwd(), "data", "profile.json");
const blobPath = "profile.json";

function blobEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

async function readJsonFile() {
  const text = await fs.readFile(filePath, "utf8");
  const parsed = normalizeProfile(JSON.parse(text));
  return parsed.profile;
}

async function readBlob() {
  const { get } = await import("@vercel/blob");
  const result = await get(blobPath, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  const text = await new Response(result.stream).text();
  return normalizeProfile(JSON.parse(text)).profile;
}

export async function readProfile() {
  if (blobEnabled()) {
    try {
      const profile = await readBlob();
      if (profile) return profile;
    } catch (error) {
      console.error("读取 Blob 失败，改用项目内的资料文件。", error);
    }
  }

  try {
    return await readJsonFile();
  } catch (error) {
    console.error("读取资料文件失败。", error);
    return normalizeProfile({}).profile;
  }
}

export async function saveProfile(input) {
  const { errors, profile } = normalizeProfile(input);
  if (errors.length > 0) {
    const error = new Error(errors[0]);
    error.status = 400;
    throw error;
  }

  if (blobEnabled()) {
    const { put } = await import("@vercel/blob");
    await put(blobPath, JSON.stringify(profile, null, 2), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return profile;
  }

  if (process.env.VERCEL) {
    const error = new Error(
      "线上环境还没有连接 Vercel Blob，资料没有保存。请在 Vercel 创建 Blob 存储并连接到这个项目。"
    );
    error.status = 503;
    throw error;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(profile, null, 2)}\n`, "utf8");
  return profile;
}
