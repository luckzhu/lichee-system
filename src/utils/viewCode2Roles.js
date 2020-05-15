export function viewCode2Roles(arr) {
  const roles = []
  let name
  arr.forEach(item => {
    if (item.viewCode && !roles.includes(item.viewCode)) {
      roles.push(item.viewCode)
    }
    name = item.unitName
  })
  return { roles, name }
}
