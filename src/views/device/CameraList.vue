<template>
  <div>
    <div class="search-box">
      <el-row :gutter="20">
        <el-col :span="5">
          <div class="search-item">
            <div class="label" style="width: 80px;">监控点名称</div>
            <el-input
              v-model="search.name"
              class="input-area"
              placeholder="请输入监控点名称"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="19">
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
    <el-table
      :data="list"
      max-height="350"
      style="width: 100%;margin-top: 15px;"
      border
    >
      <el-table-column align="center" label="监控点名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{
            scope.row.createTime
              ? scope.row.createTime.substring(0, 10) +
                " " +
                scope.row.createTime.substring(11, 19)
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          {{
            scope.row.modifyTime
              ? scope.row.modifyTime.substring(0, 10) +
                " " +
                scope.row.modifyTime.substring(11, 19)
              : ""
          }}
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
  </div>
</template>

<script>
import { queryCameraByRegion } from "@/api/device";
export default {
  props: {
    indexCode: {
      type: String
    }
  },
  data() {
    return {
      search: {
        name: ""
      },
      list: [],
      pageNo: 1,
      pageSize: 20,
      pageSizes: [10, 20, 50, 100],
      total: 0
    };
  },
  watch: {
    indexCode: function(val) {
      this.getList();
    }
  },
  methods: {
    async getList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        regionIndexCode: this.indexCode,
        ...this.search
      };
      const res = await queryCameraByRegion(params);
      this.list = res.data.list ? res.data.list : [];
      this.total = res.data.total;
    },
    searchSubmit() {
      this.getList();
    },
    resetSearch() {
      this.search.name = "";
      this.getList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getList();
    }
  }
};
</script>

<style></style>
