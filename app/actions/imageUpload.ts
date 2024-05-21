import ImageKit from "imagekit";

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

// export async function FileUpload(formData: FormData) {
//   const image = formData.get("image") as unknown as File;

//   const arrayBuffer = await image.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   try {
//     const response = await imageKit.upload({
//       file: buffer,
//       fileName: image.name,
//     });
//     console.log(response);
//     return response;
//   } catch (error: unknown) {
//     return {
//       errors: {
//         _form: ["Something went wrong"],
//       },
//     };
//   }
// }

export async function uploadImage(formData: FormData) {
  const image = formData.get("image") as unknown as File;
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const response = await imageKit.upload({
    file: buffer,
    fileName: image.name,
  });
  return response;
}

export async function DeleteFile(fileId: string) {
  imageKit.deleteFile(fileId, function (error, result) {
    if (error) {
      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    } else {
      console.log("hasil hapous image ", result);
      return result;
    }
  });
}
