export default function existsInArray(array: any[], id: string) {

  for (let i = 0; i < array.length; i++) {

    if (array[i]._id === id) {
      return true;
    }
  }
  return false;
}