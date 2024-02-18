import { projectFirestore } from "@/firebase/config";
import {
  collection,
  getCountFromServer,
  onSnapshot,
  query,
  limit,
  startAfter,
  getDoc,
  doc,
  endBefore,
  limitToLast,
} from "firebase/firestore";
import { ref } from "vue";

const getCollectionPaginate = (pathCollection, queryDocs,callback) => {

  const error = ref(null);

  let querySnapshot;
 
  const collectionRef = collection(projectFirestore, pathCollection);

  // ============= query data =============
  querySnapshot = query(collectionRef, ...queryDocs);

  // ============= Function previousPage =============
  const previousPage = async (page, newLimited) => {
    try {
    
      let firstVisible = await getDoc(doc(projectFirestore, pathCollection, page));
   
      querySnapshot = query(
        collectionRef,
        ...queryDocs,
        endBefore(firstVisible),
        limitToLast(newLimited)
      );
      getData();
   
    } catch (err) {
      return err.message;
    }
  };

  // ============= Function nextPage =============
  const nextPage = async (page, newLimited) => {
    try {
    
      let firstVisible = await getDoc(doc(projectFirestore, pathCollection, page));
      querySnapshot = query(
        collectionRef,
        ...queryDocs,
        startAfter(firstVisible),
        limit(newLimited)
      );
      getData();
    } catch (err) {
      return err.message;
    }
  };

  //get collection length from server
  const getCollectionLength = async (collectioName,condition) => {
    const colRef=collection(projectFirestore,collectioName);
    const q=query(colRef, ...condition)
    const res = await getCountFromServer(q);
    return res.data().count;
  };

  



  // query snapshot all documents in collection
  const getData = () => {
    const unsubscribe = onSnapshot(querySnapshot, (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });

        if (callback) {
            callback(data);
        }
    }, (err) => {
        error.value = err.message;
    });

    return unsubscribe;
};

  

  getData();


  return {
    getData,
    error,
    previousPage,
    nextPage,
    getCollectionLength,
  };
};

export default getCollectionPaginate;
