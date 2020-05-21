export function viewCode2Roles(obj) {
  const roles = []
  obj.permissioninfo.forEach(item => {
    if (item.viewCode && !roles.includes(item.viewCode)) {
      roles.push(item.viewCode)
    }
  })
  return { roles, name: obj.name }
}
