<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['gpt:model:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['gpt:model:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['gpt:model:remove']"
              >删除</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="modelList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="false" />
        <el-table-column label="类型" align="center" prop="type">
          <template #default="scope">
            <el-text v-if="scope.row.type === 1">文字</el-text>
            <el-text v-if="scope.row.type === 2">图像</el-text>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="图标" align="center" prop="icon">
          <template #default="scope">
            <ImagePreview v-if="scope.row.url" :width="100" :height="100" :src="scope.row.url" :preview-src-list="[scope.row.url]" />
          </template>
        </el-table-column>
        <el-table-column label="模型值" align="center" prop="value" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['gpt:model:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['gpt:model:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改模型信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="modelFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="文字" :value="1"></el-option>
            <el-option label="图像" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="图标" prop="ossId">
          <imageUpload v-model="form.ossId" :limit="1" />
        </el-form-item>
        <el-form-item label="模型值" prop="value">
          <el-input v-model="form.value" placeholder="请输入模型值" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Model" lang="ts">
import { listModel, getModel, delModel, addModel, updateModel } from '@/api/gpt/model';
import { ModelVO, ModelQuery, ModelForm } from '@/api/gpt/model/types';
import ImagePreview from "@/components/ImagePreview/index.vue";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const modelList = ref<ModelVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const modelFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ModelForm = {
  id: undefined,
  name: undefined,
  icon: undefined,
  value: undefined,
  ossId: undefined,
}
const data = reactive<PageData<ModelForm, ModelQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    deptId: undefined,
    userId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    ossId: [
      { required: true, message: "图标不能为空", trigger: "blur" }
    ],
    value: [
      { required: true, message: "模型值不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询模型信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listModel(queryParams.value);
  modelList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  modelFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: ModelVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加模型信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: ModelVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getModel(_id);
  Object.assign(form.value, res.data);
  form.value.ossId = form.value.icon + ''
  dialog.visible = true;
  dialog.title = "修改模型信息";
}

/** 提交按钮 */
const submitForm = () => {
  modelFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if(form.value.ossId) {
        form.value.icon = form.value.ossId
      }
      if (form.value.id) {
        await updateModel(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addModel(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ModelVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除模型信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delModel(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('gpt/model/export', {
    ...queryParams.value
  }, `model_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
