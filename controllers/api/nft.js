'use strict'

const path = require('path');
const fs = require('fs')
const { readdir } = require('fs/promises');
const nftHelper = require('../../helpers/dna-parser')

class NFTController {
  async get (req, res, next) {
    const { type, id } = req.params
    let { width = 500, height = 500, glow = 'true' } = req.query;
    if (!type || !id) {
      res.status(404).json({ error: 'Wrong format' })
    }

    if (type === 'item' || type === 'avatar') {
      const nft = await nftHelper.get(type, id);
      console.log('nfft', nft);
      if (nft) {
        nft['glow_color'] = nft.primary_color.replace(')', ', 0.5)').replace('rgb', 'rgba');

        res.setHeader('Content-Type', 'image/svg+xml');
        if (type === 'item') {
          res.render('layouts/new-item', {
            ...nft,
            layout: 'new-item.hbs',
            color: nft?.primary_color || '#FFD011',
            width: width,
            height: height,
            glow,
            deltaX: width / 100 * 50,
            deltaY: height / 100 * 50
        })
        }
        if (type === 'avatar') {
          const body_key = `${nft.sex_bio}-${nft.body_strength}-${nft.body_type}`;
          res.render('layouts/new-avatar', {
            layout: 'new-avatar.hbs',
            ...nft,
            body_key,
            width: width,
            height: height,
            leftBody: 20,
            topBody: 220,
            leftHead: 25,
            topHead: -60,
            glow,
            noseNumber: id % 4,
            mouthNumber: id % 5,
            eyesNumber: id % 4 + 1,
          })
        }
      } else {
        res.status(404).json({ error: 'File not found' })
        
      }
      
    } else if (type === 'gem') {
      const folderPath = path.resolve(`resources/${type}/`)
      const files = await readdir(folderPath)
      const filename = files.find((f) => f.startsWith(`${id}.`));
      const filePath = path.resolve(`resources/${type}/${filename}`);
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath)
      } else {
        res.status(404).json({ error: 'File not found' })
      }
    } else {
      res.status(404).json({ error: 'File not found' })
    }
  }
}

module.exports = new NFTController()
