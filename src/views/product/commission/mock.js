export const mockData = mock()

function mock() {
  const data = []
  for (let i = 0; i < 800; i++) {
    data.push(
      { zh: 'Executive Care Pro 2', en: '「亚洲至尊」医疗计划2', pId: `CGP2 (${i})`, years: '4', year1: '20', year2: '30', year4: '90' }
    )
    data.push({})
  }
  return data
}
