import { projectFirestore } from "@/firebase/config";
import {doc, collection ,addDoc,deleteDoc, setDoc ,updateDoc} from 'firebase/firestore';
import {ref} from 'vue';
const useDocument = (collectionName, id, subcollection) => {
    const error = ref(null);
    const isPending = ref(false);
    let documentRef;
    let collectionRef;
    
    const addDocs = async (formDoc) => {
        documentRef = doc(projectFirestore,collectionName, id);
        collectionRef = collection(documentRef, subcollection);
        try{
            isPending.value = true;
            await addDoc(collectionRef, formDoc);
            isPending.value = false;
        }catch(err){
            error.value = err.message;
            isPending.value = true;
        }
    }
    const setDocs = async (formDoc, docID) => {
        collectionRef = doc(projectFirestore,`${collectionName}/${id}/${subcollection}/${docID}`);
        try{
            isPending.value = true;
            await setDoc(collectionRef, formDoc);
            isPending.value = false;
        }catch(err){
            error.value = err.message;
            isPending.value = true;
        }
    }

    const updateDocs = async (docID, formDoc) => {
        documentRef = doc(doc(projectFirestore,collectionName,id),subcollection, docID);
        try{
            isPending.value = true;
            await updateDoc(documentRef, formDoc);
            isPending.value = false;
            error.value = null;
        }catch(err){
            error.value = err.message;
            isPending.value = true;
        }
    }

    const deleteDocs = async (docID) => {
        documentRef = doc(doc(projectFirestore,collectionName,id),subcollection, docID);
        try{
            isPending.value = true;
            await deleteDoc(documentRef);
            isPending.value = false;
        }catch(err){
            error.value = err.message;
            isPending.value = false;
        }
    }

    return {addDocs, deleteDocs, updateDocs ,setDocs,error, isPending}
};

export default useDocument;