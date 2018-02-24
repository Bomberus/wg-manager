import axios from 'axios'
export const GET_DINNER_TODAY = async (state) => {
  try {
    const meal = await axios.get('https://cors-anywhere.herokuapp.com/http://app.sap.eurest.de:80/mobileajax/data/35785f54c4f0fddea47b6d553e41e987/all.json')
    state.commit('SET_MEAL', meal.data.menu[3].counters)
    // state.commit('SET_MEAL', [{title: 'Hello World'}])
  } catch (e) {
    //
  }
}
