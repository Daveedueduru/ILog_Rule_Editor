<template>
  <div>
    <div class="formPositionList">
      <div class="row">
        <div class="col-9">
          <table class="table table-hover">
            <thead class="thead-dark">
              <tr>
                <th>CUID</th>
                <th>User Name</th>
                <th>User Role</th>
                <th>Created By</th>
                <th>Updated By</th>

                <th v-if="user_role == adminLocal || user_role == superUserLocal">Edit</th>
                <th v-if="user_role == adminLocal || user_role == superUserLocal">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="users in pageOfItems"
                :class="{
                  editing: users == editedUser,
                  editRecordChange: editUserIdArr.includes(users.userRoleId)
                }"
                v-bind:key="users.userRoleId"
              >
                <td>
                  <div class="view">{{ users.cuid }}</div>
                  <div>
                    <input
                      type="text"
                      v-model="users.cuid"
                      :class="{
                        editing1: users.cuid == '',
                        edit: users.cuid
                      }"
                      @keypress="checkAlphaNumeric($event)"
                    />
                  </div>
                </td>

                <td>
                  <div class="view">{{ users.userName }}</div>
                  <div>
                    <input
                      type="text"
                      v-model="users.userName"
                      :class="{
                        editing1: users.userName == '',
                        edit: users.userName
                      }"
                      @keypress="checkAlphaNumeric($event)"
                    />
                  </div>
                </td>

                <td>
                  <div class="view">{{ users.userRole }}</div>
                  <div class="edit">
                    <select
                      v-model="users.userRole"
                      :class="{
                        editing1: users.userRole == '',
                        edit: users.userRole
                      }"
                    >
                      <option>ADMIN</option>
                      <option>SUPER USER</option>
                    </select>
                  </div>
                </td>

                <td>
                  <div class="view">{{ users.createdBy }}</div>
                  <div class="edit">{{ users.createdBy }}</div>
                </td>

                <td>
                  <div class="view">{{ users.updatedBy }}</div>
                  <div class="edit">{{ users.updatedBy }}</div>
                </td>

                <td>
                  <div class="view">
                    <i
                      class="fa fa-edit"
                      style="font-size:24px;color:green;cursor:pointer;"
                      @click="
                        editData(users);
                        addEditedUserIndex(users.userRoleId);
                      "
                    ></i>
                  </div>
                </td>
                <td>
                  <div class="view">
                    <input
                      type="checkbox"
                      style="cursor:pointer;"
                      @click="addDeleteUserIndex($event, users.userRoleId)"
                      :checked="deleteUserIdArr.includes(users.userRoleId)"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td class="buttonPos" colspan="6">
                  <div id="list-wrapper" v-if="editUserIdArr.length > 0">
                    <input
                      type="button"
                      value="Update"
                      class="btn btn-primary"
                      @click="updateUser()"
                    />
                  </div>
                </td>
                <td class="aligncenter">
                  <div id="list-wrapper" v-if="deleteUserIdArr.length > 0">
                    <input
                      type="button"
                      value="Delete"
                      class="btn btn-danger"
                      @click="deleteUser()"
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
            :items="userList"
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
import UserRolePage from "../UserRoleTabs/UserRolePage";
import {
  secureLS,
  epLoadUserRole,
  epUpdateUserRole,
  epDeleteUserRole,
  admin,
  superUser,
} from "../main";

import mixin from "../mixins/Mixins";
export default {
  mixins: [mixin],
  components: {
    UserRolePage,
  },
  data() {
    return {
      adminLocal: admin,
      superUserLocal: superUser,
      userList: [],
      editUserIdArr: [],
      deleteUserIdArr: [],
      editedRecordArr: [],
      deleteRecordArr: [],
      editedUser: null,
      editMode: false,
      createdBy: "",
      cuid: "",
      userName: "",
      userRole: "",
      updatedBy: "",
      pageOfItems: [],
      intPage: 1,
      pgSize: 5,
      user_role: secureLS.get("userRole"),
    };
  },
  mounted() {
    this.fnLoadUser();
  },
  methods: {
    fnLoadUser() {
      axios.get(epLoadUserRole).then((response) => {
        this.userList = response.data.agUserRoleEntity;
      });
    },
    onChangePage(pageOfItems) {
      this.pageOfItems = pageOfItems;
    },
    updateUser: function () {
      this.$loading.show({ delay: 0 });
      this.editedRecordArr = [];
      let flag = 0;
      this.editUserIdArr.forEach((val) => {
        let userData = this.userList.find((i) => i.userRoleId == val);
        if (flag == 0 && (userData.cuid == "" || userData.userName == "")) {
          flag = 1;
        }
        let updateUserArray = {
          isActive: userData.isActive,
          createdBy: userData.createdBy,
          userName: userData.userName,
          userRole: userData.userRole,
          cuid: userData.cuid,
          updatedBy: secureLS.get("cuid"),
          userRoleId: userData.userRoleId,
          createdTime: userData.createdTime,
          updatedTime: userData.updatedTime,
        };

        this.editedRecordArr.push(updateUserArray);
      });
      if (flag == 1) {
        this.$loading.hide();
        this.$toast.error("Blank value not allowed");
        return false;
      }
      axios.put(epUpdateUserRole, this.editedRecordArr).then(() => {
        this.$loading.hide();
        this.$toast.open("User Updated Successfully");
        this.loadUsers();
      });
    },
    addEditedUserIndex: function (userRoleId) {
      this.colorFlag = userRoleId;
      if (!this.editUserIdArr.includes(userRoleId)) {
        // It checks this   index is available or not in the Array
        this.editUserIdArr.push(userRoleId);
      }
    },
    deleteUser: function () {
      this.$loading.show({ delay: 0 });
      this.deleteRecordArr = [];

      this.deleteUserIdArr.forEach((val) => {
        let userData = this.userList.find((i) => i.userRoleId == val);
        let deleteUserArray = {
          isActive: userData.isActive,
          createdBy: userData.createdBy,
          userName: userData.userName,
          userRole: userData.userRole,
          cuid: userData.cuid,
          updatedBy: secureLS.get("cuid"),
          userRoleId: userData.userRoleId,
          createdTime: userData.createdTime,
          updatedTime: userData.updatedTime,
        };
        this.deleteRecordArr.push(deleteUserArray);
      });
      axios
        .delete(epDeleteUserRole, {
          data: this.deleteRecordArr,
        })
        .then(() => {
          this.$loading.hide();
          this.$toast.open("User Deleted Successfully");
          this.loadUsers();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    addDeleteUserIndex: function (event, userRoleId) {
      if (event.target.checked) {
        this.deleteUserIdArr.push(userRoleId);
      } else {
        this.deleteUserIdArr.pop(userRoleId);
      }
    },
    editData(users) {
      this.beforEditCache = users;
      this.editedUser = users;
    },
    loadUsers: function () {
      this.editUserIdArr = [];
      this.deleteUserIdArr = [];

      this.fnLoadUser();
    },
  },
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
.buttonPos {
  text-align: right;
}
.aligncenter {
  text-align: center;
}
.editing1 {
  border: 2px solid red;
}
</style>
