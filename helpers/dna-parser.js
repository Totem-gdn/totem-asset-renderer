'use strict'
const { DNAParser, ContractHandler } = require('totem-dna-parser')

class NFT {
  constructor() {
    this.ApiURL = process.env.API_URL;
    this.Contracts = {
      avatar: process.env.AVATAR_CONTRACT,
      item: process.env.ITEM_CONTRACT,
      gem: process.env.GEM_CONTRACT
    }
  }
  async get (type, id) {
    try {
      let rJson = {};

      let defaultJson = DNAParser.defaultAvatarJson;

      if (type === 'item') {
        defaultJson = DNAParser.defaultItemJson;
      }

      const contractHandler = new ContractHandler(this.ApiURL, this.Contracts[type]);
      const dna = await contractHandler.getDNA(id);
      const parser = new DNAParser(defaultJson, dna);
      const properties = parser.getFilterPropertiesList()
      let jsonProp = {...properties};
      let settings = {};
      for (const key in properties) {
        if (Object.hasOwnProperty.call(properties, key)) {
          settings[jsonProp[key]] = parser.getField(properties[key]);
        }
      }

      if (type === 'item') {
        rJson = settings;
      }

      if (type === 'avatar') {
        rJson = this.generateAvatarJson(settings);
      }
      return rJson;
    } catch (e) {
      console.log(e)
    }
  }


  generateAvatarJson(avatarSetting) {
    // avatarSetting['human_skin_color_darken'] = this.adjust(avatarSetting.human_skin_color, -50);
    // avatarSetting['human_hair_color_lighten'] = this.adjust(avatarSetting.human_hair_color, 150);

   
    return avatarSetting;
  }

  adjust(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }
}

module.exports = new NFT()