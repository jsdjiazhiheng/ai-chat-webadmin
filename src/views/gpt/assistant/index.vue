<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="助手名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入助手名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="所属模型" prop="model">
            <el-input v-model="queryParams.model" placeholder="请输入所属模型" clearable style="width: 240px" @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['gpt:assistant:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['gpt:assistant:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['gpt:assistant:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['gpt:assistant:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="assistantList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="false" />
        <el-table-column label="助手名称" align="center" width="200" prop="name" />
        <el-table-column label="图标" align="center" width="80" prop="icon" />
        <el-table-column label="所属模型" align="center" width="100" prop="model" />
        <el-table-column label="描述" align="center" show-overflow-tooltip prop="description" />
        <el-table-column label="招呼语" align="center" show-overflow-tooltip prop="greet" />
        <el-table-column label="系统提示" align="center" show-overflow-tooltip prop="systemPrompt" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['gpt:assistant:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['gpt:assistant:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改AI助手对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="700px" append-to-body>
      <el-form ref="assistantFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="助手名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入助手名称" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item label="所属模型" prop="model">
          <el-select v-model="form.model" placeholder="请选择所属模型">
            <el-option v-for="item in modelList" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="5" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="招呼语" prop="greet">
          <el-input v-model="form.greet" type="textarea" placeholder="请输入招呼语" />
        </el-form-item>
        <el-form-item label="系统提示" prop="systemPrompt">
          <el-input v-model="form.systemPrompt" type="textarea" :rows="5" placeholder="请输入内容" />
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

<script setup name="Assistant" lang="ts">
import { listAssistant, getAssistant, delAssistant, addAssistant, updateAssistant } from '@/api/gpt/assistant';
import { AssistantVO, AssistantQuery, AssistantForm } from '@/api/gpt/assistant/types';
import {getModelList} from "@/api/gpt/model";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const assistantList = ref<AssistantVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const modelList = ref()

const queryFormRef = ref<ElFormInstance>();
const assistantFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: AssistantForm = {
  id: undefined,
  name: undefined,
  icon: undefined,
  model: undefined,
  description: undefined,
  greet: undefined,
  systemPrompt: undefined,
}
const data = reactive<PageData<AssistantForm, AssistantQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    model: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "助手名称不能为空", trigger: "blur" }
    ],
    model: [
      { required: true, message: "所属模型不能为空", trigger: "blur" }
    ],
    systemPrompt: [
      { required: true, message: "系统提示不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询模型列表 */
const getModel = async () => {
  const res = await getModelList()
  modelList.value = res.data
}

/** 查询AI助手列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAssistant(queryParams.value);
  assistantList.value = res.rows;
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
  assistantFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: AssistantVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加AI助手";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: AssistantVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getAssistant(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改AI助手";
}

/** 提交按钮 */
const submitForm = () => {
  assistantFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateAssistant(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addAssistant(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: AssistantVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除AI助手编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delAssistant(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('gpt/assistant/export', {
    ...queryParams.value
  }, `assistant_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
  getModel();
});
</script>
