export const SET_MEAL = (state, counters) => {
  state.meals = counters.slice(0, 4).map((oCounter) => {
    return {
      title: oCounter.title.de,
      detail: oCounter.dishes[0].title.de
    }
  })
}
