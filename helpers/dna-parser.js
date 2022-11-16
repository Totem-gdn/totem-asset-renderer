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
        rJson = this.generateItemJson(settings);
      }

      if (type === 'avatar') {
        rJson = this.generateAvatarJson(settings);
      }
      return rJson;
    } catch (e) {
      console.log(e)
    }
  }

  generateItemJson(itemSetting) {
    itemSetting.typeColors = ['#84DFF3', '#B5F9E8', '#51A490'];
    switch (itemSetting.classical_element) {
      case 'Air':
        itemSetting.typeColors = ['#84DFF3', '#B5F9E8', '#51A490'];
        break;
      case 'Earth':
        itemSetting.typeColors = ['#9FFC2A', '#36ED7F', '#418E1D'];
        break;
      case 'Fire':
        itemSetting.typeColors = ['#FC2A50', '#ED3636', '#9C1818'];
        break;
      case 'Water':
        itemSetting.typeColors = ['#2A97FC', '#73A3D0', '#184D9C'];
        break;
      default:
        itemSetting.typeColors = ['#9FFC2A', '#36ED7F', '#418E1D'];
        break;
    }
    itemSetting.weaponColor = '#8A939B';
    switch (itemSetting.weapon_material) {
      case 'Iron':
        itemSetting.weaponColor = '#61666A';
        break;
      case 'Steel':
        itemSetting.weaponColor = '#71797E';
        break;
      case 'Silver':
        itemSetting.weaponColor = '#C0C0C0';
        break;
      case 'Gold':
        itemSetting.weaponColor = '#FFD700';
        break;
      default:
        itemSetting.weaponColor = '#8A939B';
        break;
    }

    return itemSetting;
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