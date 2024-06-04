<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="模型" prop="model">
            <el-input v-model="queryParams.model" placeholder="请输入模型" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-input v-model="queryParams.role" placeholder="请输入角色" clearable style="width: 240px" @keyup.enter="handleQuery" />
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
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['chat:chatMessage:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['chat:chatMessage:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="chatMessageList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="false" />
        <el-table-column label="模型" align="center" width="100" prop="model" />
        <el-table-column label="模型版本" align="center" width="150" prop="modelVersion" />
        <el-table-column label="角色" align="center" width="100" prop="role" />
        <el-table-column label="内容" align="left" header-align="center" show-overflow-tooltip>
          <template #default="scope">
            <el-text v-if="scope.row.role === 'user'" class="mx-1">{{scope.row.content}}</el-text>
            <el-text v-if="scope.row.role === 'assistant' && scope.row.contentType === 'TEXT'" class="mx-1">{{scope.row.content}}</el-text>
            <template v-if="scope.row.role === 'assistant' && scope.row.contentType === 'IMAGE'">
              <el-image
                v-for="(item, index) in scope.row.imageList"
                style="width: 100px; height: 100px"
                :preview-src-list="[item]"
                :preview-teleported="true"
                :z-index="99999"
                :key="index"
                :src="item"
                fit="cover"
              />
            </template>
          </template>
        </el-table-column>
        <el-table-column label="内容类型" align="center" width="80" prop="contentType">
          <template #default="scope">
            <el-tag v-if="scope.row.contentType === 'IMAGE'">图片</el-tag>
            <el-tag v-if="scope.row.contentType === 'TEXT'">文本</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="80" prop="status">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1">回复中</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success">成功</el-tag>
            <el-tag v-if="scope.row.status === 3" type="danger">失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['chat:chatMessage:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="ChatMessage" lang="ts">
import { listChatMessage, delChatMessage } from '@/api/gpt/chatMessage';
import { ChatMessageVO, ChatMessageQuery, ChatMessageForm } from '@/api/gpt/chatMessage/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const chatMessageList = ref<ChatMessageVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();

const data = reactive<PageData<ChatMessageForm, ChatMessageQuery>>({
  form: {} as ChatMessageForm,
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    chatId: undefined,
    messageId: undefined,
    parentMessageId: undefined,
    model: undefined,
    role: undefined,
    content: undefined,
    contentType: undefined,
    params: {
    }
  },
  rules: {} as ElFormRules
});

const { queryParams } = toRefs(data);

/** 查询对话消息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listChatMessage(queryParams.value);
  chatMessageList.value = res.rows;
  total.value = res.total;
  loading.value = false;
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
const handleSelectionChange = (selection: ChatMessageVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 删除按钮操作 */
const handleDelete = async (row?: ChatMessageVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除对话消息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delChatMessage(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('gpt/chat/message/export', {
    ...queryParams.value
  }, `chatMessage_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
