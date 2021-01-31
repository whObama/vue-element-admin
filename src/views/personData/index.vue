<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col class="tree-left" :span="4" :offset="0">
        <div class="tree-container">
          <div class="tool">
            <el-popover
              ref="popover-add"
              placement="bottom-start"
              width="300"
              trigger="click"
            >
              <organization-edit
                :node-data="currentNode"
                @closePoper="handlerClosePoper"
              />
              <el-button
                slot="reference"
                type="primary"
                class="el-icon-plus"
                title="添加"
                @click="handleNodeAdd('add')"
              />
            </el-popover>

            <el-popover
              ref="popover-edit"
              placement="bottom-start"
              width="300"
              trigger="click"
            >
              <organization-edit
                :node-data="currentNode"
                @closePoper="handlerClosePoper"
              />
              <el-button
                slot="reference"
                type="primary"
                class="el-icon-edit"
                title="修改"
                @click="handleNodeEdit('edit')"
              />
            </el-popover>

            <el-button
              type="danger"
              class="el-icon-delete"
              :disabled="delDisabled"
              title="删除"
              @click="handleNodeDel"
            />
          </div>
          <el-input
            v-model="filterText"
            class="filter-tree-input"
            placeholder="输入关键字进行过滤"
          />
          <el-tree
            ref="tree"
            class="filter-tree"
            accordion
            :data="treeData"
            :props="defaultProps"
            node-key="orgIndexCode"
            :default-expanded-keys="defaultExpandeArr"
            :highlight-current="true"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node }" class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20" :offset="0">
        <div class="search-box">
          <el-row :gutter="20">
            <el-col :span="4">
              <div class="search-item">
                <div class="label" style="width: 80px;">姓名</div>
                <el-input
                  v-model="search.name"
                  class="input-area"
                  placeholder="请输入姓名"
                  clearable
                />
              </div>
            </el-col>
            <el-col :span="4">
              <div class="search-item">
                <div class="label" style="width: 80px;">性别</div>
                <el-select
                  v-model="search.gender"
                  placeholder="请选择"
                  class="input-area"
                >
                  <el-option
                    v-for="item in sexList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-col>
            <!-- <el-col :span="4">
              <div class="search-item">
                <div class="label" style="width: 80px;">手机号码</div>
                <el-input
                  class="input-area"
                  placeholder="请输入手机号码"
                  v-model="search.phone"
                  clearable>
                </el-input>
              </div>
            </el-col> -->
            <el-col :span="4">
              <div class="search-item">
                <div class="label" style="width: 80px;">证件类型</div>
                <el-select
                  v-model="search.certType"
                  placeholder="请选择"
                  class="input-area"
                >
                  <el-option
                    v-for="item in certTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="search-item">
                <div class="label" style="width: 80px;">证件号码</div>
                <el-input
                  v-model="search.certNo"
                  class="input-area"
                  placeholder="请输入证件号码"
                  clearable
                />
              </div>
            </el-col>
            <el-col :span="4">
              <div class="search-item" style="margin-right: 0px;">
                <div class="label" style="width: 80px;">工号</div>
                <el-input
                  v-model="search.jobNo"
                  class="input-area"
                  placeholder="请输入工号"
                  clearable
                />
              </div>
            </el-col>
            <el-col :span="4">
              <div class="button-content">
                <div class="button-box">
                  <el-button type="primary" @click="searchSubmit"
                    >确定查询</el-button
                  >
                  <el-button type="warning" @click="resetSearch"
                    >取消查询</el-button
                  >
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="24">
              <div class="button-content">
                <div class="button-box">
                  <el-button type="primary" @click="searchSubmit">确定查询</el-button>
                  <el-button type="warning" @click="resetSearch">取消查询</el-button>
                </div>
              </div>
            </el-col>
          </el-row> -->
        </div>
        <div class="btn-box">
          <el-button class="top-button" type="primary" @click="handleAdd"
            >添加人员</el-button
          >
          <el-button
            class="top-button"
            type="danger"
            :disabled="removeDisabled"
            @click="removeMore"
            >批量删除人员</el-button
          >
          <el-button class="top-button" type="grey" icon="el-icon-upload2" @click="handleUpload"
            >导入</el-button
          >
          <el-button
            class="top-button"
            type="grey"
            :disabled="removeDisabled"
            icon="el-icon-download"
            @click="handleExport"
            >导出</el-button
          >
          <el-checkbox v-model="isContainChild" class="contain-child"
            >包含下级组织</el-checkbox
          >
        </div>

        <el-table
          :data="list"
          style="width: 100%;"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column align="center" label="姓名">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="性别" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.gender === 1">男</span>
              <span v-else-if="scope.row.gender === 2">女</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <!-- <el-table-column align="header-center" label="所属组织">
            <template slot-scope="scope">
              {{ scope.row.orgName }}
            </template>
          </el-table-column> -->
          <el-table-column align="center" label="证件类型">
            <template slot-scope="scope">
              <span v-if="scope.row.certType == 111">身份证</span>
              <span v-else-if="scope.row.certType == 131">工作证</span>
              <span v-else-if="scope.row.certType == 335">驾驶证</span>
              <span v-else-if="scope.row.certType == 113">户口本</span>
              <span v-else-if="scope.row.certType == 133">学生证</span>
              <span v-else>其他</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="证件号码">
            <template slot-scope="scope">
              {{ scope.row.certNo }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="工号">
            <template slot-scope="scope">
              {{ scope.row.jobNo }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号码">
            <template slot-scope="scope">
              {{ scope.row.phone }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="描述">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="人员图片" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.faceUrl" class="mini-img">
                <!-- <img :src="scope.row.faceUrl" alt="" @click="preview('single', scope.row.faceUrl)"/> -->
                <el-image
                  style="width: 100%; height: 100%"
                  :src="picUrl + scope.row.faceUrl"
                  :preview-src-list="[picUrl + scope.row.faceUrl]"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope)"
                >修改</el-button
              >
              <el-button type="danger" size="small" @click="handleDelete(scope)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="width: 100%;"
          :current-page="pageNo"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

    <el-dialog
      width="30%"
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改人员' : '添加人员'"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="name">
          <el-tooltip
            class="item"
            effect="light"
            content="1~32 位字符；不含 ' / \ : * ?  < > | 这些特殊字符"
            placement="top"
          >
            <el-input
              v-model="form.name"
              placeholder="姓名"
              :maxlength="num32"
            />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select
            v-model="form.gender"
            style="width: 100%;"
            placeholder="请选择"
            class="input-area"
          >
            <el-option
              v-for="item in formSexList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="证件类型" prop="certType">
          <el-select
            v-model="form.certType"
            style="width: 100%;"
            placeholder="请选择"
            class="input-area"
          >
            <el-option
              v-for="item in certTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="certNo">
          <el-tooltip
            class="item"
            effect="light"
            content="小于等于32个字符,只允许数字和字母"
            placement="top"
          >
            <el-input
              v-model="form.certNo"
              placeholder="证件号码"
              :maxlength="num32"
            />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="工号" prop="jobNo">
          <el-tooltip
            class="item"
            effect="light"
            content="小于等于32个字符,只允许数字和字母"
            placement="top"
          >
            <el-input
              v-model="form.jobNo"
              placeholder="工号"
              :maxlength="num32"
            />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-tooltip
            class="item"
            effect="light"
            content="1-11位数字"
            placement="top"
          >
            <el-input
              v-model="form.phone"
              placeholder="手机号码"
              :maxlength="num11"
            />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="上传图片" prop="faceUrl">
          <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :http-request="UploadFile"
            :before-upload="beforeUpload"
          >
            <img
              v-if="form.faceUrl"
              :src="picUrl + form.faceUrl"
              class="avatar"
            />
            <!-- <i v-if="form.faceUrl" class="el-icon-delete upload-delete"
              @click.stop="removeUpload(form.faceUrl, form.indexCode)" /> -->
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <el-button type="danger" @click="resetForm('form')">取消</el-button>
      </div>
    </el-dialog>
    <!-- 人员信息导入 -->
    <el-dialog
      title="导入人员信息"
      :visible.sync="uploadDialogVisible"
      width="50%"
      class="person-upload">
      <div class="organization-text">
        <span>目标组织:</span>
        <span style="padding-left: 5px">{{ currentNode.name }}</span>
      </div>
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="人员基本信息" name="first">
            <el-alert
              type="info"
              description="向目标组织下批量导入人员信息。请提前根据文件模板中的要求收集人员信息，人员信息实名标识：身份证件"
              show-icon
              :closable="false">
            </el-alert>
            <el-form :model="uploadPersonForm" :rules="uploadPersonRules" ref="uploadPersonForm" label-width="100px" class="demo-ruleForm" style="margin-top: 20px;">
              <el-form-item prop="name" class="uploadCSV">
                <el-input class="uploadCSVInput" v-model="uploadPersonForm.name" readonly placeholder="选择导入文件"></el-input>
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :http-request="UploadPersonCSV"
                  :before-upload="beforeUploadCSV">
                  <el-button class="uploadCSVBtn" icon="el-icon-folder-add"></el-button>
                </el-upload>
              </el-form-item>
              <el-form-item style="margin-right: 100px">
                <div class="upload-explain">
                  <p>
                    <el-popover
                      placement="bottom-start"
                      width="400"
                      trigger="hover">
                      <ul>
                        <li>姓名:1～32个字符；不能包含 ' / \: * ? " < > | 这些特殊字符。</li>
                        <li>性别:1:男 2:女 0:未知 。</li>
                        <li>组织路径:必填；目标组织/下级组织。</li>
                        <li>证件类型:111:身份证 414:护照 113:户口簿 335:驾驶证 131:工作证 133:学生证 114:军官证 990:其他 。</li>
                        <li>证件号码:1-20位数字、字母。</li>
                        <li>工号:1～32个字母、数字、汉字。</li>
                        <li>手机号码:1-20位数字。</li>
                      </ul>
                      <el-button slot="reference" type="text">字段说明</el-button>
                    </el-popover>
                    <span class="line"></span>
                    <el-button type="text" @click="downloadPersonModule">下载文件模板</el-button>
                  </p>
                  <p>支持导入总记录数5万条以内，文件大小在50M以内的CSV格式文件。</p>
                </div>
              </el-form-item>
              <el-form-item>
                <div class="uploadCSVChecked">选择文件后将自动上传并进行数据校验</div>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" :disabled="isUploadPersonForm" @click="subUploadPersonForm('uploadPersonForm')">导入</el-button>
                <el-button @click="resetUploadPersonForm('uploadPersonForm')">取消</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="人员照片" name="second">
            <el-alert
              type="info"
              description="	向目标组织下批量导入人员正面免冠照，导入前建议使用人脸照片预处理工具进行质量清洗，并确认照片对应的人员信息是否存在。"
              show-icon
              :closable="false">
            </el-alert>
            <el-form :model="uploadPersonPic" :rules="uploadPersonPicRules" ref="uploadPersonPic" label-width="100px" class="demo-ruleForm" style="margin-top: 20px;">
              <el-form-item prop="name" class="uploadCSV">
                <el-input class="uploadCSVInput" v-model="uploadPersonPic.name" readonly placeholder="选择导入文件"></el-input>
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :http-request="UploadPersonPic"
                  :before-upload="beforeUploadPic">
                  <el-button class="uploadCSVBtn" icon="el-icon-folder-add"></el-button>
                </el-upload>
              </el-form-item>
              <el-form-item style="margin-right: 100px">
                <div class="upload-explain">
                  <p style="line-height: 20px; margin-bottom: 10px;">支持导入200MB以内的ZIP文件，建议文件中包含照片的数量在1000张以内；照片命名规则为姓名_证件号码.jpg，需露出眉毛和眼睛；单张照片文件大小10KB~200KB。</p>
                </div>
              </el-form-item>
              <el-form-item>
                <div class="uploadCSVChecked">选择文件后将自动上传并进行数据校验</div>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" :disabled="isuploadPersonPic" @click="subuploadPersonPic('uploadPersonPic')">导入</el-button>
                <el-button @click="resetuploadPersonPic('uploadPersonPic')">取消</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="uploadSup">取 消</el-button>
        <el-button type="primary" @click="uploadCancel">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  queryPersonList,
  addPerson,
  deletePerson,
  updatePerson,
  uploadFile,
  removeFile,
  queryOrgTree,
  deleteOrg,
  checkImportCsv,
  importPersonBaseMsg,
  checkImageZip,
  importPersonImg
} from "@/api/person";
import {
  name,
  valueRequired,
  indexCode,
  notRequiredCode,
  phone,
  file
} from "@/utils/regExp";
import OrganizationEdit from "./organization/OrganizationEdit";
import qs from 'querystring'

export default {
  components: {
    OrganizationEdit
  },
  data() {
    return {
      sexList: [
        {
          value: 3,
          label: "全部"
        },
        {
          value: 1,
          label: "男"
        },
        {
          value: 2,
          label: "女"
        },
        {
          value: 0,
          label: "未知"
        }
      ],
      certTypeList: [
        {
          value: 111,
          label: "身份证"
        },
        {
          value: 131,
          label: "工作证"
        },
        {
          value: 335,
          label: "驾驶证"
        },
        {
          value: 113,
          label: "户口本"
        },
        {
          value: 133,
          label: "学生证"
        },
        {
          value: 990,
          label: "其他"
        }
      ],
      formSexList: [
        {
          value: 0,
          label: "未知"
        },
        {
          value: 1,
          label: "男"
        },
        {
          value: 2,
          label: "女"
        }
      ],
      search: {
        name: "",
        gender: 3,
        certType: 111,
        // phone: '',
        certNo: "",
        jobNo: ""
      },
      removeDisabled: true,
      form: {
        name: "",
        gender: 1,
        certType: 111,
        certNo: "",
        phone: "",
        jobNo: "",
        faceUrl: "",
        description: "",
        indexCode: ""
      },
      rules: {
        name: [{ required: true, validator: name, trigger: "blur" }],
        gender: [{ required: true, validator: valueRequired, trigger: "blur" }],
        certType: [
          { required: true, validator: valueRequired, trigger: "blur" }
        ],
        certNo: [{ required: true, validator: indexCode, trigger: "blur" }],
        jobNo: [
          { required: false, validator: notRequiredCode, trigger: "blur" }
        ],
        phone: [{ required: false, validator: phone, trigger: "blur" }]
      },
      action: "",
      num32: 32,
      num11: 11,
      list: [],
      dialogVisible: false,
      dialogType: "new",
      pageNo: 1,
      pageSize: 20,
      pageSizes: [10, 20, 50, 100],
      total: 0,
      filterText: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      defaultExpandeArr: [],
      currentNode: {},
      // 是否删除组织
      delDisabled: true,
      multipleSelectData: [],
      // 图片url
      picUrl: "http://10.192.93.114:17012/cms/download/static/",
      // 是否包含下级组织
      isContainChild: false,
      // 导入人员信息弹框
      uploadDialogVisible: false,
      // 导入人员信息表单
      uploadPersonForm: {
        name: ''
      },
      // 上传成功的文件
      csvFile: null,
      uploadPersonRules: {
        name: [{ required: false, validator: file, trigger: "blur" }]
      },
      isUploadPersonForm: true,
      activeName: 'first',
      // 导入人员图片表单
      uploadPersonPic: {
        name: ''
      },
      // 上传成功的图片
      csvPic: null,
      uploadPersonPicRules: {
        name: [{ required: false, validator: file, trigger: "blur" }]
      },
      isuploadPersonPic: true,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    isContainChild: function(val) {
      this.getList();
    },
    uploadPersonForm: {
      handler: function(val) {
        if (val.name) {
            this.isUploadPersonForm = false
        } else {
          this.isUploadPersonForm = true
        }
      },
      deep: true
    },
    uploadPersonPic: {
      handler: function(val) {
        if (val.name) {
          this.isuploadPersonPic = false
        } else {
          this.isuploadPersonPic = true
        }
      },
      deep: true
    }
  },
  created() {
    // this.getList()
    this.initTree();
  },
  methods: {
    initTree() {
      queryOrgTree()
        .then(res => {
          if (res.code === "0") {
            if (res.data) {
              this.treeData = [res.data];
              this.$nextTick().then(() => {
                const firstNode = document.querySelector(".el-tree-node");
                firstNode.click();
              });
            } else {
              this.treeData = [];
            }
            this.getList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeAdd(type) {
      this.currentNode = {
        ...this.currentNode,
        type
      };
    },
    handleNodeEdit(type) {
      this.currentNode = {
        ...this.currentNode,
        type
      };
    },
    handleNodeDel() {
      this.$confirm(
        "确定删除" + this.currentNode.name + "组织节点及其下级组织节点?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const params = {
            name: this.currentNode.name,
            indexCode: this.currentNode.orgIndexCode
          };
          deleteOrg(params).then(result => {
            if (result.code === "0") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.initTree();
            }
          });
        })
        .catch(() => {});
    },
    // 关闭proper
    handlerClosePoper(type) {
      this.$refs["popover-" + type].doClose();
      this.initTree();
    },
    handleNodeClick(data) {
      this.currentNode = data;
      if (data.orgIndexCode === "root000000") {
        this.delDisabled = true;
      } else {
        this.delDisabled = false;
      }
      this.getList();
    },
    async getList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        orgIndexCode: this.currentNode.orgIndexCode,
        isContainChild: this.isContainChild,
        ...this.search
      };
      const res = await queryPersonList(params);
      this.list = res.data.list;
      this.total = res.data.total;
    },
    searchSubmit() {
      this.getList();
    },
    resetSearch() {
      this.search.name = "";
      this.search.gender = 3;
      this.search.certType = 111;
      this.search.certNo = "";
      this.search.jobNo = "";
      this.getList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getList();
    },
    handleAdd() {
      this.dialogType = "new";
      this.dialogVisible = true;
      this.form.name = "";
      this.form.gender = 1;
      this.form.certType = 111;
      this.form.certNo = "";
      this.form.phone = "";
      this.form.jobNo = "";
      this.form.faceUrl = "";
      this.form.description = "";
      this.form.indexCode = "";
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.form.name = scope.row.name;
      this.form.gender = scope.row.gender;
      this.form.certType = scope.row.certType;
      this.form.certNo = scope.row.certNo;
      this.form.phone = scope.row.phone;
      this.form.jobNo = scope.row.jobNo;
      this.form.faceUrl = scope.row.faceUrl;
      this.form.description = scope.row.description;
      this.form.indexCode = scope.row.indexCode;
    },
    // 校验上传文件
    beforeUpload(file, fileList) {
      const isRightType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isRightSize = file.size / 1024 / 1024 <= 10;
      if (
        isRightType !== "jpg" &&
        isRightType !== "png" &&
        isRightType !== "jpeg"
      ) {
        this.$message.error("请选择.jpg、.jpeg、.png格式的图片！");
        return false;
      }
      if (!isRightSize) {
        this.$message.error("上传图片大小不能超过10M!");
        return false;
      }
    },
    // 图片上传
    UploadFile(param) {
      const fd = new FormData();
      fd.append("file", param.file); // 要提交给后台的文件
      uploadFile(fd)
        .then(res => {
          if (res.code === "0" && res.data) {
            this.$message({
              type: "success",
              message: `文件上传成功`
            });
            this.form.faceUrl = res.data;
          }
        })
        .catch(err => {
          console.log(err);
          return false;
        });
    },
    // 删除图片
    removeUpload(url, indexcode) {
      removeFile({ faceUrl: url, indexCode })
        .then(res => {
          if (res.code === "0") {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.form.faceUrl = "";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogType === "new") {
            delete this.form.indexCode;
            addPerson({
              ...this.form,
              orgIndexCode: this.currentNode.orgIndexCode
            })
              .then(res => {
                if (res.code === "0") {
                  this.$message({
                    type: "success",
                    message: "保存成功"
                  });
                  this.dialogVisible = false;
                  this.getList();
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            updatePerson({
              ...this.form,
              orgIndexCode: this.currentNode.orgIndexCode
            })
              .then(res => {
                if (res.code === "0") {
                  this.$message({
                    type: "success",
                    message: "保存成功"
                  });
                  this.dialogVisible = false;
                  this.getList();
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          // this.$refs[formName].resetFields()
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    handleDelete({ $index, row }) {
      this.$confirm("确定删除" + row.name + "吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = [];
          params.push(row.indexCode);
          deletePerson({ indexCodes: params })
            .then(result => {
              if (result.code === "0") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getList();
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.multipleSelectData = val;
      if (this.multipleSelectData.length > 0) {
        this.removeDisabled = false;
      } else {
        this.removeDisabled = true;
      }
    },
    removeMore() {
      const params = [];
      this.multipleSelectData.forEach(item => {
        params.push(item.indexCode);
      });
      this.$confirm(
        "确认从人员列表中删除" + this.multipleSelectData.length + "个人员吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          deletePerson({ indexCodes: params }).then(result => {
            if (result.code === "0") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList();
            }
          });
        })
        .catch(err => {
          console.log("获取请求失败" + err);
        });
    },
    // 导出
    handleExport () {
      const params = [];
      this.multipleSelectData.forEach(item => {
        params.push(item.indexCode);
      });
      this.$confirm(
        "确认从人员列表中导出选中(共" + this.multipleSelectData.length + "条)人员信息?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          window.location.href = `http://10.192.93.114:17012/cms/person/exportPerson?` + qs.stringify({indexCodes: params})
          // window.location.href = `${process.env.BASE_URL}person/exportPerson?` + qs.stringify({indexCodes: params})
        })
        .catch(err => {
          console.log(err)
        });
    },
    handleUpload () {
      this.uploadDialogVisible = true
      this.uploadPersonForm.name = ''
      this.uploadPersonPic.name = ''
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    UploadPersonCSV (param) {
      const fd = new FormData();
      fd.append("file", param.file); // 要提交给后台的文件
      fd.append("parentOrgId", this.currentNode.orgIndexCode)
      checkImportCsv(fd)
        .then(res => {
          if (res.code === "0") {
            this.$message({
              type: "success",
              message: `文件上传成功`
            })
            this.csvFile = param
            this.uploadPersonForm.name = this.csvFile.file.name
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    beforeUploadCSV (file, fileList) {
      const isRightType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isRightSize = file.size / 1024 / 1024 <= 50;
      if (
        isRightType !== "csv"
      ) {
        this.$message.error("请选择.csv格式的文件！");
        return false;
      }
      if (!isRightSize) {
        this.$message.error("上传文件大小不能超过50M!");
        return false;
      }
    },
    subUploadPersonForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const fd = new FormData();
          fd.append("file", this.csvFile.file); // 要提交给后台的文件
          fd.append("parentOrgId", this.currentNode.orgIndexCode)
          importPersonBaseMsg(fd)
            .then(res => {
              if (res.code === "0") {
                this.$message({
                  type: "success",
                  message: `文件导入成功`
                })
                this.activeName = 'second'
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          // this.$refs[formName].resetFields()
          return false;
        }
      })
    },
    resetUploadPersonForm (formName) {
      this.$refs[formName].resetFields()
      this.uploadDialogVisible = false
    },
    // 人员基本信息模板下载
    downloadPersonModule () {
      window.location.href = `http://10.192.93.114:17012/cms/person/downloadPersonModule`
      // window.location.href = `http://10.192.91.47:8080/ctm05blvas/blvas/api/v1/file/download?` + qs.stringify(params)
      // window.location.href = `${process.env.BASE_URL}blvas/api/v1/file/download?` + qs.stringify(params)
    },
    beforeUploadPic (file, fileList) {
      const isRightType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isRightSize = file.size / 1024 / 1024 <= 200;
      if (
        isRightType !== "zip"
      ) {
        this.$message.error("请选择.zip格式的文件！");
        return false;
      }
      if (!isRightSize) {
        this.$message.error("上传文件大小不能超过200M!");
        return false;
      }
    },
    UploadPersonPic (param) {
      const fd = new FormData();
      fd.append("file", param.file); // 要提交给后台的文件
      checkImageZip(fd)
        .then(res => {
          if (res.code === "0") {
            this.$message({
              type: "success",
              message: `文件上传成功`
            })
            this.csvPic = param
            this.uploadPersonPic.name = this.csvPic.file.name
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    subuploadPersonPic (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            fileName: this.uploadPersonPic.name
          }
          importPersonImg(params)
            .then(res => {
              if (res.code === "0") {
                this.$message({
                  type: "success",
                  message: `文件导入成功`
                })
                this.uploadDialogVisible = false
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          // this.$refs[formName].resetFields()
          return false;
        }
      })
    },
    resetuploadPersonPic (formName) {
      this.$refs[formName].resetFields()
      this.uploadDialogVisible = false
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
.app-container {
  min-height: 845px;
  .tree-left {
    min-height: 805px;
    border-right: 1px solid #{$textColor1};
  }
  .tree-container {
    height: 100%;
    .filter-tree-input {
      margin-bottom: 10px;
      .el-input__inner {
        background: transparent;
      }
      .el-tree {
        // overflow: scroll;
        background: transparent;
        .el-tree-node {
          .el-tree-node__content {
            &:active,
            &:hover {
              background: #58aef5;
            }
          }
        }
        .is-current {
          background: #1890ff !important;
        }
      }
      .el-tree--highlight-current
        .el-tree-node.is-current:not(.is-drag)
        > .el-tree-node__content {
        background: #1890ff;
      }
      .is-current {
        background: #1890ff;
      }
    }
    .tool {
      margin-bottom: 10px;
      .el-button {
        margin-right: 10px;
      }
      i {
        margin: 0 8px;
        padding: 2px;
        font-size: 18px;
      }
      i:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: rgb(64, 158, 255) !important;
    color: #fff;
  }
  .mini-img {
    width: 60px;
    height: 60px;
    margin: 10px 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    // width: 178px;
    // height: 178px;
    // line-height: 178px;
    width: 96px;
    height: 96px;
    line-height: 96px;
    text-align: center;
  }
  .avatar {
    width: 96px;
    height: 96px;
    // width: 178px;
    // height: 178px;
    display: block;
  }
  .el-upload:hover .upload-delete {
    display: inline-block;
  }
  .upload-delete {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    color: #f4f4f4;
    display: none;
  }
  .btn-box {
    width: 100%;
    .contain-child {
      float: right;
      line-height: 66px;
      margin-right: 10px;
    }
  }
}
.person-upload {
  .el-dialog__body {
    padding: 0 0 30px;
    .organization-text {
      padding: 0 20px 10px;
      color: #{$textColor3};
      border-bottom: 1px solid #{$textColor1};
    }
    .content {
      padding: 0 20px;
      .el-tabs__header {
        margin-bottom: 0;
      }
      .uploadCSV {
        margin-right: 100px;
        margin-bottom: 12px;
        .el-form-item__content {
          display: flex;
          // justify-content: space-between;
          .uploadCSVInput {
            .el-input__inner {
              border-right: 0;
              border-radius: 0;
            }
          }
          .uploadCSVBtn {
            padding-left: 30px;
            padding-right: 30px;
            border-radius: 0;
          }
        }
      }
      .upload-explain {
        border-bottom: 1px solid #{$textColor1};
        p {
          display: flex;
        }
        .line {
          display: inline-block;
          height: 16px;
          margin: 8px 20px 0;
          border-left: 1px solid #{$textColor1};
        }
      }
      .uploadCSVChecked {
        color: #{$textColor10};
        font-size: 18px;
        font-weight: 500;
      }
    }
  }
}
</style>
