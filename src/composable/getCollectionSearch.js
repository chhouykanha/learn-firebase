import { projectFirestore } from "@/firebase/config";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  endAt,
  startAt,
  limit,
} from "firebase/firestore";
import { ref, watchEffect } from "vue";

const getCollectionSearch = (collectionName, selector, field) => {
  const documents = ref([]);
  const error = ref(null);
  const isPending = ref(false);
  let querySnapshot;
  const collectionRef = collection(projectFirestore, `${collectionName}`);

  if (selector) {
    querySnapshot = query(
      collectionRef,
      orderBy(field),
      startAt(selector),
      endAt(selector + "\uf8ff"),
      limit(100)
    );
  } else {
    querySnapshot = query(
      collectionRef,
      orderBy("createdAt", "desc"),
      limit(100)
    );
  }
  const unsubscribe = onSnapshot(
    querySnapshot,
    (snapshot) => {
      isPending.value = true;
      const results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      documents.value = results;
      isPending.value = false;
      error.value = null;
    },

    (err) => {
      console.log("err", err);
      error.value = err.message;

      isPending.value = false;
      documents.value = null;
    }
  );

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsubscribe());
  });

  return {
    documents,
    error,
    isPending,
  };
};

export default getCollectionSearch;
