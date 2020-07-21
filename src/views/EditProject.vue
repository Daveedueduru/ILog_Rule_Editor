<template>
  <div>
    <div class="formPositionList">
      <div class="row">
        <div class="col-4">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Domain</label>
            </div>
            <select class="custom-select" v-model="domain" @change="fnFilterProject($event)">
              <option disabled value>-- Select --</option>

              <option>All</option>
              <option
                v-for="domains in domainList"
                :key="domains.domainId"
                :value="domains.domainId"
              >{{ domains.domainName }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-9">
          <table class="table table-hover" v-if="showTable">
            <thead class="thead-dark">
              <tr>
                <th>Project Name</th>
                <th>Project Description</th>
                <th>Created By</th>

                <th>Updated By</th>

                <th v-if="user_role == adminLocal || user_role == superUserLocal">Edit</th>
                <th v-if="user_role == adminLocal || user_role == superUserLocal">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(projects, index) in pageOfItems"
                :key="index"
                :class="{
                  editing: projects == editedProject,
                  editRecordChange: updateProjectIdArr.includes(
                    projects.projectId
                  )
                }"
              >
                <td>
                  <div class="view">{{ projects.projectName }}</div>
                  <div>
                    <input
                      type="text"
                      v-model="projects.projectName"
                      :class="{
                        editing1: projects.projectName == '',
                        edit: projects.projectName
                      }"
                      @keypress="checkAlphaNumeric($event)"
                    />
                  </div>
                </td>
                <td>
                  <div class="view">{{ projects.projectType }}</div>
                  <div>
                    <input
                      type="text"
                      v-model="projects.projectType"
                      :class="{
                        editing1: projects.projectType == '',
                        edit: projects.projectType
                      }"
                    />
                  </div>
                </td>
                <td>
                  <div class="view">{{ projects.createdBy }}</div>
                  <div class="edit">{{ projects.createdBy }}</div>
                </td>
                <td>
                  <div class="view">{{ projects.updatedBy }}</div>
                  <div class="edit">{{ projects.updatedBy }}</div>
                </td>
                <td v-if="user_role == adminLocal || user_role == superUserLocal">
                  <div class="view">
                    <i
                      class="fa fa-edit"
                      style="font-size:24px;color:green;cursor:pointer;"
                      @click="
                        addEditedIndex(projects.projectId);
                        editData(projects);
                      "
                    ></i>
                  </div>
                </td>

                <td v-if="user_role == adminLocal || user_role == superUserLocal">
                  <div class="view">
                    <input
                      type="checkbox"
                      style="cursor:pointer;"
                      @click="addDeleteProjectIndex($event, projects.projectId)"
                      :checked="deleteProjectIdArr.includes(projects.projectId)"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td class="buttonPos" colspan="5">
                  <div id="list-wrapper" v-if="updateProjectIdArr.length > 0">
                    <input
                      type="button"
                      value="Update"
                      class="btn btn-primary"
                      @click="updateProject($event)"
                    />
                  </div>
                </td>
                <td>
                  <div id="list-wrapper" v-if="deleteProjectIdArr.length > 0">
                    <input
                      type="button"
                      value="Delete"
                      class="btn btn-danger"
                      @click="deleteProject($event)"
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
            :items="projectList"
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
import ProjectNav from "../components/ProjectNav";
import Main from "../components/Main";
import axios from "axios";
import {
  secureLS,
  epLoadDomain,
  epLoadProject,
  epUpdateProject,
  epDeleteProject,
  admin,
  superUser
} from "../main";
import mixin from "../mixins/Mixins";
export default {
  mixins: [mixin],
  components: {
    ProjectNav,
    Main
  },
  data() {
    return {
      adminLocal: admin,
      superUserLocal: superUser,
      showTable: false,
      user_role: secureLS.get("userRole"),
      createdBy: "",
      projectName: "",
      projectType: "",
      updatedBy: "",
      projectList: [],
      domainList: "",
      updateProjectIdArr: [],
      deleteProjectIdArr: [],
      deleteRecordArr: [],
      editedRecordArr: [],
      editedProject: null,
      editMode: false,
      slectedDomain: "",
      pageOfItems: [],
      intPage: 1,
      pgSize: 5,
      domain: ""
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
          this.$loading.hide();
        },
        error => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },
    onChangePage(pageOfItems) {
      this.pageOfItems = pageOfItems;
    },
    fnFilterProject(event, dm = "") {
      this.$loading.show({ delay: 0 });
      this.updateProjectIdArr = [];
      this.deleteProjectIdArr = [];
      if (dm) {
        this.slectedDomain = dm;
      } else {
        this.slectedDomain = event.target.value;
      }
      if (this.slectedDomain == "All") {
        axios.get(epLoadProject).then(
          response => {
            this.projectList = response.data.agRuleProjectEntity;
            if (this.projectList.length > 0) {
              this.showTable = true;
              this.$loading.hide();
            } else {
              this.$toast.error("No data found");
            }
            this.$loading.hide();
          },
          error => {
            this.$toast.error("Something went wrong. Please contact Admin.");
            this.$loading.hide();
          }
        );
      } else {
        axios.get(epLoadProject + "?domainId=" + this.slectedDomain).then(
          response => {
            this.projectList = response.data.agRuleProjectEntity;
            if (this.projectList.length > 0) {
              this.showTable = true;
              this.$loading.hide();
            } else {
              this.$toast.error("No data found");
            }
            this.$loading.hide();
          },
          error => {
            this.$toast.error("Something went wrong. Please contact Admin.");
            this.$loading.hide();
          }
        );
      }
    },

    updateProject: function(event) {
      this.editedRecordArr = [];
      this.$loading.show({ delay: 0 });
      let flag = 0;
      this.updateProjectIdArr.forEach(val => {
        let projectData = this.projectList.find(i => i.projectId == val);
        if (
          flag == 0 &&
          (projectData.projectName == "" || projectData.projectType == "")
        ) {
          flag = 1;
        }
        let updateProjectArray = {
          isActive: projectData.isActive,
          projectId: projectData.projectId,
          createdBy: projectData.createdBy,
          projectName: projectData.projectName,
          projectType: projectData.projectType,
          updatedBy: secureLS.get("cuid"),
          domainId: projectData.domainId
        };
        this.editedRecordArr.push(updateProjectArray);
      });
      if (flag == 1) {
        this.$toast.error("Blank value not allowed");
        this.$loading.hide();
        return false;
      }
      axios.put(epUpdateProject, this.editedRecordArr).then(
        data => {
          if (data.data.statusCode == 200) {
            this.$loading.hide();
            this.$toast.open("Project Updated Successfully");
            this.fnFilterProject(event, this.slectedDomain);
          } else {
            this.$toast.error("Failed to update");
          }
        },
        error => {
          this.$toast.error("Something went wrong. Please contact Admin.");
          this.$loading.hide();
        }
      );
    },
    addEditedIndex: function(index) {
      this.updateProjectIdArr.push(index);
    },
    editData(projects) {
      this.beforEditCache = projects;
      this.editedProject = projects;
    },

    deleteProject: function(event) {
      this.deleteRecordArr = [];
      this.$loading.show({ delay: 0 });
      this.deleteProjectIdArr.forEach(val => {
        let projectData = this.projectList.find(i => i.projectId == val);
        let deleteProjectArray = {
          isActive: projectData.isActive,
          projectId: projectData.projectId,
          createdBy: projectData.createdBy,
          projectName: projectData.projectName,
          projectType: projectData.projectType,
          updatedBy: secureLS.get("cuid"),
          domainId: projectData.domainId
        };
        this.deleteRecordArr.push(deleteProjectArray);
      });
      axios
        .delete(epDeleteProject, {
          data: this.deleteRecordArr
        })
        .then(
          data => {
            if (data.data.statusCode == 200) {
              this.$loading.hide();
              this.$toast.open("Project Deleted Successfully");
              this.fnFilterProject(event, this.slectedDomain);
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
    addDeleteProjectIndex: function(event, projectId) {
      if (event.target.checked) {
        if (!this.deleteProjectIdArr.includes(projectId)) {
          this.deleteProjectIdArr.push(projectId);
        }
      } else {
        this.deleteProjectIdArr.splice(
          this.deleteProjectIdArr.indexOf(projectId),
          1
        );
      }
    }
  }
};
</script>

<style scoped>
@import "../assets/navstyle.css";

[v-cloak] {
  display: none;
}
.domSel {
  position: absolute;
  top: 170px;
  left: 375px;
  font-size: 15px;
}
.edit {
  display: none;
}
.editing .edit {
  display: block;
}
.editing .view {
  display: none;
}
.buttonPos {
  text-align: right;
}
.editing1 {
  border: 2px solid red;
}
</style>
