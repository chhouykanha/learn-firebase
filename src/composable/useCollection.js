import {projectFirestore} from '@/firebase/config.js';
import {
 collection,
 addDoc,
 deleteDoc,
 doc
} from "firebase/firestore";
import {ref} from 'vue';

const useCollection = (collectionName) => {
    let collectionRef = collection(projectFirestore , collectionName); //items
    const error = ref(null);
    const isPending = ref(null);

   const addDocs = async (formDoc) => {
        error.value = null;
        
    try{
        isPending.value = true;
        await addDoc(collectionRef, formDoc);
        isPending.value = false;
        return true;
    }catch(err){
        error.value = err.message;
        isPending.value = false;
    }   
  };

  const removeDocs = async (docID) => {
        error.value = null;
        try {
            isPending.value = true;
            await deleteDoc(doc(collectionRef, docID));
            isPending.value = false;
        } catch (err) {
            error.value = err.message;
            isPending.value = false;
        }
  }


  return {addDocs,removeDocs, error, isPending}

}

export default useCollection;