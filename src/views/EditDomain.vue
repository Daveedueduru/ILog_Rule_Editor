<template>
  <div>
    <div class="formPositionList">
      <div class="row">
        <div class="col-9">
          <table class="table table-hover" v-if="showTable">
            <thead class="thead-dark">
              <tr>
                <th>Domain Name</th>
                <th>Domain Description</th>
                <th>Created By</th>

                <th>Updated By</th>

                <th v-if="user_role == adminLocal || user_role == superUserLocal">Edit</th>
                <th v-if="user_role == adminLocal || user_role == superUserLocal">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="domains in pageOfDomainList"
                :class="{
                  editing: domains == editedDomain,
                  editRecordChange: editDomainIdArr.includes(domains.domainId)
                }"
                v-bind:key="domains.domainId"
              >
                <td>
                  <div class="view">{{ domains.domainName }}</div>
                  <div>
                    <input
                      type="text"
                      v-model="domains.domainName"
                      :class="{
                        editing1: domains.domainName == '',
                        edit: domains.domainName
                      }"
                      @keypress="checkAlphaNumeric($event)"
                    />
                    <!-- <input type="text" v-model="domains.domainName" v-if="domains.domainName" /> -->
                  </div>
                </td>
                <td>
                  <div class="view">{{ domains.domainDesc }}</div>
                  <div>
                    <!-- <input type="text" v-model="domains.domainDesc" /> -->
                    <input
                      type="text"
                      v-model="domains.domainDesc"
                      :class="{
                        editing1: domains.domainDesc == '',
                        edit: domains.domainDesc
                      }"
                    />
                  </div>
                </td>
                <td>
                  <div class="view">{{ domains.createdBy }}</div>
                  <div class="edit">{{ domains.createdBy }}</div>
                </td>

                <td>
                  <div class="view">{{ domains.updatedBy }}</div>
                  <div class="edit">{{ domains.updatedBy }}</div>
                </td>
                <td v-if="user_role == adminLocal || user_role == superUserLocal">
                  <div class="view">
                    <i
                      class="fa fa-edit"
                      style="font-size:24px;color:green;cursor: pointer;"
                      @click="
                        editData(domains);
                        addEditedDomainIndex(domains.domainId);
                      "
                    ></i>
                  </div>
                </td>
                <td v-if="user_role == adminLocal || user_role == superUserLocal">
                  <div class="view">
                    <input
                      type="checkbox"
                      style="cursor: pointer;"
                      @click="addDeleteDomainIndex($event, domains.domainId)"
                      :checked="deleteDomainIdArr.includes(domains.domainId)"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td class="buttonPos" colspan="5">
                  <div id="list-wrapper" v-if="editDomainIdArr.length > 0">
                    <input
                      type="button"
                      value="Update"
                      class="btn btn-primary"
                      @click="updateDomain()"
                    />
                  </div>
                </td>
                <td class>
                  <div id="list-wrapper" v-if="deleteDomainIdArr.length > 0">
                    <input
                      type="button"
                      value="Delete"
                      class="btn btn-danger"
                      @click="deleteDomain()"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-9">
          <jw-pagination
            :items="domainList"
            :pageSize="pgSize"
            :initialPage="intPage"
            @changePage="onChangePage"
          ></jw-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "font-awesome/css/font-awesome.css";
import DomainNav from "../components/DomainNav";
import {
  secureLS,
  epDeleteDomain,
  epUpdateDomain,
  epLoadDomain,
  superUser,
  admin
} from "../main";

import mixin from "../mixins/Mixins";
export default {
  mixins: [mixin],
  components: {
    DomainNav
  },
  data() {
    return {
      adminLocal: admin,
      superUserLocal: superUser,
      user_role: secureLS.get("userRole"),
      domainList: [],
      editDomainIdArr: [],
      deleteDomainIdArr: [],
      editedRecordArr: [],
      deleteRecordArr: [],
      editedDomain: null,
      editMode: false,
      createdBy: "",
      domainDesc: "",
      domainName: "",
      updatedBy: "",
      pageOfDomainList: [],
      intPage: 1,
      pgSize: 10,
      showTable: false,
      res: ""
    };
  },
  mounted() {
    this.fnLoadDomain();
  },
  methods: {
    fnLoadDomain() {
      this.$loading.show({ delay: 0 });
      axios.get(epLoadDomain).then(
        response => {
          this.domainList = response.data.agDomainRuleEntity;
          console.log(this.domainList.length);
          this.showTable = true;
          this.$loading.hide();
        },
        error => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },
    onChangePage(pageOfDomainList) {
      this.pageOfDomainList = pageOfDomainList;
    },
    updateDomain: function() {
      this.editedRecordArr = [];
      this.$loading.show({ delay: 0 });
      let flag = 0;
      this.editDomainIdArr.forEach(val => {
        let domainData = this.domainList.find(i => i.domainId == val);
        if (
          flag == 0 &&
          (domainData.domainName == "" || domainData.domainDesc == "")
        ) {
          flag = 1;
        }
        let updateDomainArray = {
          isActive: domainData.isActive,
          createdBy: domainData.createdBy,
          domainName: domainData.domainName,
          domainDesc: domainData.domainDesc,
          updatedBy: secureLS.get("cuid"),
          domainId: domainData.domainId
        };
        this.editedRecordArr.push(updateDomainArray);
      });
      if (flag == 1) {
        this.$toast.error("Blank Value Not Allowed");
        this.$loading.hide();
        return false;
      }
      axios.put(epUpdateDomain, this.editedRecordArr).then(
        data => {
          if (data.data.statusCode == 200) {
            this.$toast.open("Domain Updated Successfully");
            this.loadDomains();
            this.$loading.hide();
          } else {
            this.$toast.error("Failed to Update");
          }
        },
        error => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },
    addEditedDomainIndex: function(domainId) {
      this.colorFlag = domainId;
      if (!this.editDomainIdArr.includes(domainId)) {
        // It checks this   index is available or not in the Array
        this.editDomainIdArr.push(domainId);
      }
    },
    deleteDomain: function() {
      this.deleteRecordArr = [];
      this.$loading.show({ delay: 0 });
      this.deleteDomainIdArr.forEach(val => {
        let domainData = this.domainList.find(i => i.domainId == val);
        let deleteDomainArray = {
          isActive: "N",
          createdBy: domainData.createdBy,
          domainName: domainData.domainName,
          domainDesc: domainData.domainDesc,
          updatedBy: secureLS.get("cuid"),
          domainId: domainData.domainId
        };
        this.deleteRecordArr.push(deleteDomainArray);
      });
      axios
        .delete(epDeleteDomain, {
          data: this.deleteRecordArr
        })
        .then(
          data => {
            if (data.data.statusCode == 200) {
              console.log(data.data.statusCode);
              this.$toast.open("Domain Deleted Successfully");
              this.loadDomains();
              this.$loading.hide();
            } else {
              this.$toast.error("Failed to Delete");
            }
          },
          error => {
            this.$toast.error("Something went wrong. Please contact Admin.");
            this.$loading.hide();
          }
        )
        .catch(function(error) {
          console.log(error);
        });
    },
    addDeleteDomainIndex: function(event, domainId) {
      if (event.target.checked) {
        if (!this.deleteDomainIdArr.includes(domainId)) {
          this.deleteDomainIdArr.push(domainId);
        }
      } else {
        this.deleteDomainIdArr.splice(
          this.deleteDomainIdArr.indexOf(domainId),
          1
        );
      }
    },
    editData(domains) {
      this.beforEditCache = domains;
      this.editedDomain = domains;
    },
    loadDomains: function() {
      this.editDomainIdArr = [];
      this.deleteDomainIdArr = [];
      this.fnLoadDomain();
    }
  }
};
</script>

<style scoped>
@import "../assets/navstyle.css";

.edit {
  display: none;
}
.editing .edit {
  display: block;
}
.editing .view {
  display: none;
}
.editing1 {
  border: 2px solid red;
}
.buttonPos {
  text-align: right;
}
</style>
