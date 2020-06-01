<template>
  <span>
    <el-button
      :loading="downloadLoading"
      style="margin-bottom:20px"
      type="primary"
      size="mini"
      icon="el-icon-document"
      @click="exportExcel"
    >
      <slot />
    </el-button>
  </span>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  props: {
    // 过滤列数，['selection','name','handle']
    // selection 多选栏
    // index 序号列
    // name 传正常列的prop
    // handle slot-column自定的 class-name
    // eslint-disable-next-line
    filterArr: {
      type: Array
    },
    tableId: {
      type: String,
      default: 'tableId'
    },
    fileName: {
      type: String,
      default: '导出数据'
    }
  },
  data() {
    return {
      downloadLoading: false
    }
  },
  methods: {
    columnDisplay(display) {
      if (this.filterArr) {
        this.filterArr.forEach(item => {
          const elements = document.querySelectorAll(`.${item}`)
          for (let i = elements.length - 1; i >= 0; i--) {
            // elements[i].parentNode.removeChild(elements[i])
            elements[i].style.display = display
          }
        })
      }
    },
    exportExcel() {
      const xlsxParam = { raw: true, display: true }
      this.columnDisplay('none')
      const dom = document.querySelector(`#${this.tableId}`)
      const fix = document.querySelector(`#${this.tableId} .el-table__fixed`)
      let wb
      if (fix) {
        // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去
        wb = XLSX.utils.table_to_book(dom.removeChild(fix), xlsxParam)
        dom.appendChild(fix)
      } else {
        wb = XLSX.utils.table_to_book(dom, xlsxParam)
      }

      const wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })

      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream;charset=utf-8' }),
          `${this.fileName}.xlsx`
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      this.columnDisplay('table-cell')
      return wbout
    }
  }
}
</script>

