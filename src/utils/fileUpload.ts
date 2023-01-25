import { base_url } from "../data";

/**
 * @function fileUpload - works async
 * @param file - file to upload
 */
export default async function fileUpload(file: File) {
  return new Promise<number>((res, rej) => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    fetch(`${base_url}/site/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        res(data.data.id);
      })
      .catch((err) => console.log(err));
  });
}
