import {
    collection,
    onSnapshot,
    query,
    getDocs,
  } from "firebase/firestore";
  import { projectFirestore } from "@/firebase/config";
 
  
  export const getCollectionQuery = async (
    collectionName,
    whereDoc,
    callback,
    useSnapshot = false
  ) => {
    const collectionRef = collection(projectFirestore, collectionName);
  
    // Create a query based on whereDoc (if provided)
    let queryRef = collectionRef;
    if (whereDoc) {
      queryRef = query(collectionRef, ...whereDoc);
    }
  
    try {
      if (useSnapshot) {
        const unsubscribe = onSnapshot(queryRef,{ includeMetadataChanges: true } ,(snapshot) => {
          const data = [];
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          if (callback) {
            callback(data);
          }
        });
  
        return unsubscribe;
      } else {
        const snapshot = await getDocs(queryRef);
        const data = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        if (callback) {
          callback(data);
        }
      }
    } catch (error) {
      console.error("Error in getCollectionQuery:", error);
    }
  };
