import Vue from 'vue'
import Vuex from 'vuex'
import dataQueryApi from './plugins/data-query-api.js'
import employeesStore from './modules/employees-store.js'
import companiesStore from './modules/companies-store.js'
import departmentsStore from './modules/departments-store.js'
import accountsStore from './modules/accounts-store.js'
import groupsStore from './modules/groups-store.js'
import divisionStore from "./modules/divisions-store.js"
import officesStore from './modules/offices-store.js'
import authAPI from './plugins/auth-api.js'
import authorisationStore from './modules/authorisation-store.js'
import modalStore from './modules/modal-store.js'
import structureStore from './modules/structure-store.js'



Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        employeesStore,
        companiesStore,
        departmentsStore,
        accountsStore,
        groupsStore,
        divisionStore,
        officesStore,
        authorisationStore,
        modalStore,
        structureStore
    },
    plugins: [
        dataQueryApi,
        authAPI
    ]
   
})
