export const stateMap = {
  '-1': { label: '未操作', type: 'info' },
  '0': { label: '已保存', type: '' },
  '1': { label: '已提交', type: 'success' },
  '2': { label: '审核通过', type: 'warning' },
  '3': { label: '退回待修改', type: 'danger' }
}

export const licheeBreedMap = new Map([
  [101, '妃子笑'],
  [102, '白糖罂'],
  [103, '桂味'],
  [104, '黑叶'],
  [105, '糯米糍'],
  [106, '怀枝']
])

export const allBreedMap = {
  lichee: {
    name: '荔枝',
    categoryId: 100,
    bIds: {
      101: '妃子笑',
      102: '白糖罂',
      103: '桂味',
      104: '黑叶',
      105: '糯米糍',
      106: '怀枝'
    }
  },
  pomelo: {
    name: '柚子',
    categoryId: 200,
    bIds: {
      201: '红肉蜜柚',
      202: '白肉蜜柚',
      203: '沙田柚'
    }
  },
  orange: {
    name: '柑桔橙',
    categoryId: 300,
    bIds: {
      301: '脐橙',
      302: '红橙',
      303: '贡柑',
      304: '蕉柑',
      305: '沃柑',
      306: '沙糖桔',
      307: '春甜桔',
      308: '蜜橘'
    }
  },
  longan: {
    name: '龙眼',
    categoryId: 400,
    bIds: {
      401: '石硖',
      402: '储良'
    }
  }
}

export const marketingState = {
  0: '保存',
  1: '省级退回',
  2: '市级退回',
  5: '提交',
  8: '市级审核通过',
  9: '省级审核通过'
}
