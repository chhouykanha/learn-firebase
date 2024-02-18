<template>
    <Header />
    <div>Product</div>
    <form style="width:500px;">
         <div class="mb-3">
                <input type="text" class="form-control" placeholder="name" />
         </div>
         <div class="mb-3">
               <select class="form-control">
                        <option value="" disabled selected>Select Category</option>
                        <option 
                         v-for="(doc, i) in categories"
                         :value="doc.id"
                         :key="i"
                         >
                            {{ doc.name }}
                        </option>
               </select>
         </div>
         <div class="mb-3">
              <input type="number" class="form-control" placeholder="qty" />
         </div>

         <div class="mb-3">
              <input type="number" class="form-control" placeholder="price" />
         </div>

         <div class="mb-3">
              <input type="file" class="form-control"/>
         </div>
         <div class="mb-3">
              <textarea class="form-control" placeholder="type your description here"></textarea>
         </div>
         <button type="button" class="btn btn-primary d-inline-block">Save</button>
    </form>
</template>

<script>
import {onMounted, ref} from 'vue';
import Header from '@/components/Header.vue'
import {getCollectionQuery} from '@/composable/getCollection'
    export default{
        components : {
            Header
        },
        setup(){
            const categories = ref([]);

            const fetchCategories = () => {
                getCollectionQuery('categories',[], (data) => {
                    categories.value = data;
                }, true);
            }


            onMounted(() => {
                fetchCategories()
            })

            return{
                categories
            }
        }
    }
</script>


<style>

</style>