/**
 *
 * @param {Integer} pennies
 * @returns
 */
export const formatPenniesToDollars = (pennies) => {
  return (pennies / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
