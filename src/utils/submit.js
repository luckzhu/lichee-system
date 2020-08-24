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
  lichee: new Map([
    [101, '妃子笑'],
    [102, '白糖罂'],
    [103, '桂味'],
    [104, '黑叶'],
    [105, '糯米糍'],
    [106, '怀枝']
  ]),
  pomelo: new Map([
    [101, '妃子笑'],
    [102, '白糖罂'],
    [103, '桂味'],
    [104, '黑叶'],
    [105, '糯米糍'],
    [106, '怀枝']
  ])
}
