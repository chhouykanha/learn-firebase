<template>
    <Header />
    <div>Category Page</div>

    <form @submit.prevent="handleAddCategory" class="row" style="max-width: 500px;">
            <div class="col">
                <input v-model="categoryName" type="text" required class="form-control" placeholder="First name" aria-label="First name">
            </div>
            <div class="col">
                <input @change="handleImageChanges" type="file" required class="form-control">
                <small v-if="fileError">{{ fileError }}</small>
            </div>
            <button v-if="!isPending" type="submit" class="btn btn-primary">Insert</button>
            <button v-else type="submit" class="btn btn-primary">Saving...</button>
    </form>

    <select v-model="pageSize">
        <option value="2">2</option>
        <option value="4">4</option>
        <option value="6">6</option>
    </select>
    <input type="text" v-model="searchText">
    <table class="table">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Image</th>
            <th scope="col">Name</th>
            <th scope="col">CreatedAt</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(doc, i) in categories" :key="i">
                <th scope="row">{{ i + 1 }}</th>
                <td>
                    <img style="width:30px;" :src="doc.imageUrl">
                </td>
                <td>{{ doc.name }}</td>
                <td>{{ dateFormat(doc.createdAt) }}</td>
            </tr>
         
        </tbody>
</table>

<div v-if="searchText == ''">
    <span>
    {{ currentPage }}
    of
    {{ totalPages }}
</span>

<nav aria-label="Page navigation example">
  <ul class="pagination justify-content-end">
    <li class="page-item" :class="currentPage === 1 && 'disabled'">
      <a class="page-link" @click="loadPreviousPage">Previous</a>
    </li>
        <li class="page-item"><a class="page-link" href="#">{{ currentPage }}</a></li>
    <li class="page-item">
      <a class="page-link" @click="loadNextPage" :class="currentPage === totalPages && 'disabled'" href="#">Next</a>
    </li>
  </ul>
</nav>
</div>

</template>

<script>
import { format } from "date-fns";
import Header from '@/components/Header.vue';
import useCollection from '@/composable/useCollection';
import useStorage from '@/composable/useStorage';
import {onMounted, ref, watch} from 'vue';
import { timeStamp } from '@/firebase/config';
import { where, limit, orderBy, } from 'firebase/firestore';
import getCollectionPaginate from '@/composable/usePaginate';
import getCollectionSearch from '@/composable/getCollectionSearch';
    export default{
        components : {
            Header
        },
        setup(){
            const categoryName = ref('');
            const categories = ref([]);
            const file = ref('');
            const fileError = ref('');
            const imageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg'];

            const currentPage = ref(1);
            const totalPages = ref(1);
            const pageSize = ref(2);
            const searchText = ref('');

            const queryDocs = ref([
                limit(pageSize.value),
                orderBy("createdAt", 'desc'),
            ]);


            const clearData = () => {
                categoryName.value = '';
                file.value = '';
            }

            const handleImageChanges = (e) => {
                    const selected = e.target.files[0];
                    const limitedSize = 2097152;
                    
                    if(selected.size > limitedSize){
                        fileError.value = 'Size image must be equal or less than 2MB';
                        file.value = null;
                    }else{
                        if(selected && imageTypes.includes(selected.type)){
                            file.value = selected;
                            console.log(file.value)
                            fileError.value = null;
                        }else{
                            fileError.value = 'Only file of type jpg, jpeg, svg, png are allowed.';
                            file.value = null;
                        }
                    }
            }

            const {addDocs, error, isPending} = useCollection("categories");
            const {uploadImage, url} = useStorage();

            const handleAddCategory = async () => {
                handleQueryCategory()
                if(file.value){
                    try{
                        await uploadImage(file.value);
                        addDocs({
                            name : categoryName.value,
                            imageUrl: url.value,
                            createdAt: timeStamp
                        })
                        clearData()
                    }catch(err){
                        console.log(err);
                    }
                    
                }
            }

            const { previousPage, nextPage, getCollectionLength } = getCollectionPaginate("categories", queryDocs.value, (data) => {
                categories.value = data;
            });


            const handleQueryCategory = async () => {
                try {

                    queryDocs.value = [
                        limit(pageSize.value),
                        orderBy("createdAt", 'desc'),
                            ];
                            getCollectionPaginate("categories", queryDocs.value, (data) => {
                                categories.value = data;
                                currentPage.value = 1;

                            });

                            totalPages.value = Math.ceil(await getCollectionLength("categories", []) / pageSize.value);

                    } catch (err) {
                        console.log("failed to fetch data", err);
                    }

            }

            const loadPreviousPage = async () => {
                try {
                    const firstDocument = categories.value[0];
                    if (firstDocument) {
                        await previousPage(firstDocument.id, pageSize.value);
                        currentPage.value -= 1;
                    }
                } catch (err) {
                        console.error("Error fetching previous page:", err);
                    }
            };

            const loadNextPage = async () => {
                try {
                    const lastDocument = categories.value[categories.value.length - 1];
                    if (lastDocument) {
                        await nextPage(lastDocument.id, pageSize.value);
                        currentPage.value += 1;
                    }
                } catch (err) {
                    console.error("Error fetching next page:", err);
                }
            };


            const dateFormat = (date) => {
                return format(date.toDate(), 'dd/MMM/yyyy h:mm a');
            }

            watch(pageSize, async (newItemsPerPage) => {
                    queryDocs.value = [
                        limit(Number(newItemsPerPage)),
                        orderBy("createdAt", 'desc'),
                    ];
                    getCollectionPaginate("categories", queryDocs.value, (data) => {
                        categories.value = data;
                        currentPage.value = 1;
                    });

                    totalPages.value = Math.ceil(await getCollectionLength("categories", []) / pageSize.value);
             });

             watch(searchText, () => {
                if (searchText.value) {
                    const { documents } = getCollectionSearch(
                    `categories`,
                    searchText.value.trim(),
                    "name"
                    );

                    watch(documents, () => {
                        categories.value = documents.value;
                    });
                } else {
                    handleQueryCategory();
                }
            });





            onMounted(async() => {
                handleQueryCategory();
                totalPages.value = Math.ceil(await getCollectionLength("categories", []) / pageSize.value);
            })

            



            return{
                categoryName,
                categories,
                pageSize,
                currentPage,
                totalPages,
                error,
                isPending,
                fileError,
                searchText,
                dateFormat,
                handleImageChanges,
                handleAddCategory,
                loadNextPage,
                loadPreviousPage
            }
        }
    }
</script>


<style>

</style>