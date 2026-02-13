const getNameInitials = (name: any = "") => {
  const nameStr = typeof name === 'string' ? name : String(name || '');
  let abbr = "";
  let str: any = nameStr || "";
  str = str.split(" ");
  for (let i = 0; i < str.length; i++) {
    abbr += str[i].substr(0, 1);
  }
  if (abbr) {
    if (abbr[1]) {
      return abbr[0].toUpperCase() + abbr[1].toUpperCase();
    }
    return abbr[0].toUpperCase();
  }
};

const getColorInitial = (name: any = "") => {
  const nameStr = typeof name === 'string' ? name : String(name || '');
  if (nameStr && nameStr.length > 1) {
    let abbr = "";
    let str: any = nameStr || "";
    str = str.split(" ");
    for (let i = 0; i < str.length; i++) {
      abbr += str[i].substr(0, 1);
    }

    return abbr[0].toUpperCase();
  }
};

export default ({
	getNameInitials,
	getColorInitial,
})