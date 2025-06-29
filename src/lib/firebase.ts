import { Client, Storage } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("685fc473001e5d61fe7a");

export const storage = new Storage(client);

export async function uploadFile(
  file: File,
  setProgress?: (progress: number) => void
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const bucketId = "685fc48b0023b27da196";
    const endpoint = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${bucketId}/files`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.setRequestHeader("X-Appwrite-Project", "685fc473001e5d61fe7a");
    xhr.setRequestHeader("X-Appwrite-Key", "standard_9c1d8b618abdccbf046df82b0fdf3ce76f356fef6107d2ec91f8be3a5eeb8f9fec1e0a2ae6e15d891bd88bd6038caca46f415621750b914b545c4673601cddd780b35a84f380929d4e956ecaf98d10a0e44b1f8e680e2722ac22b79cc0b2ad03c698bf2ec4eb533f245db277bedbc99eebca4210b36844b06b8a57c4295b0b90");

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && setProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      }
    });

    xhr.onreadystatechange = async () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);

          // Here we use the SDK to get the proper download URL
          const downloadUrl = storage.getFileDownload(bucketId, response.$id);
          resolve(downloadUrl);
        } else {
          reject(
            new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`)
          );
        }
      }
    };

   const formData = new FormData();
formData.append("fileId", "unique()"); // this tells Appwrite to auto-generate
formData.append("file", file);

    xhr.send(formData);
  });
}
