import { projectStorage } from "@/firebase/config";
import {ref as imageRef, uploadBytes , getDownloadURL, deleteObject} from "firebase/storage";
import {ref} from 'vue';


const useStorage = () => {
  const error = ref(null);
  const url = ref(null);
  const filePath = ref(null);
  const isPending = ref(null);

  const uploadImage = async (file) => {
     filePath.value = `images/${file.name}`;
     const storageRef = imageRef(projectStorage, filePath.value);

     try {
      isPending.value = true;
      await uploadBytes(storageRef, file);
      url.value = await getDownloadURL(storageRef);
      isPending.value = false;
     } catch (err) {
       error.value = err.message;
       url.value = null;
       filePath.value = null;
       isPending.value = false;
     }
  }

  const deleteImage = async (imageURL) => {

    const storageRef = imageRef(projectStorage, imageURL);
    try {
      isPending.value = true;
      await deleteObject(storageRef);
      isPending.value = false;
    } catch (err) {
       error.value = err.message;
       isPending.value = false;
    }
  }

  return {
    uploadImage,
    deleteImage,
    error,
    isPending,
    url,
    filePath
  }
}

export default useStorage;