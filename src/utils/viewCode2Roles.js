export function viewCode2Roles(arr) {
  const roles = []
  arr.forEach(item => {
    if (item.viewCode && !roles.includes(item.viewCode)) {
      roles.push(item.viewCode)
    }
  })
  return roles
}
