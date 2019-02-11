/**
 * helper callback function for array.reduce method.
 *
 * @param {number} total
 * @param {number} population
 * @returns {number} population
 */
const sumPopulation = (total, population) => {
  total += population;
  return total;
};

/**
 * Helper function to aggregate the total population
 * in an area.
 *
 * @param {array} arr array of sub_location
 * @returns {object} total population by gender
 */
exports.getTotalPopulation = (arr) => {
  const maleArr = [];
  const femaleArr = []
  arr.forEach((item) => {
    maleArr.push(item.maleResidents);
    femaleArr.push(item.femaleResidents);
  });
  const totalMaleResidents = maleArr.reduce(sumPopulation, 0);
  const totalFemaleResidents = femaleArr.reduce(sumPopulation, 0);

  return totalPopulation = {
    totalMaleResidents,
    totalFemaleResidents
  };
}
