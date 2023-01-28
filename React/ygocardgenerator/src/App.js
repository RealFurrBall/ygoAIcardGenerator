import logo from './logo.svg';
import AppJeff from './AppJeff';
import './AppJeff.css';
import level from './images/ygolevel.png';
import './App.css';
import yugi from './images/yamiyugi.png';
import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';

function App() {

  const [cardName, setCardName] = useState('');
  const [cardAttribute, setCardAttribute] = useState("wind")
  const [cardLevel, setCardLevel] = useState("");
  const [results, setResults] = useState({
		effect: '',
		image: '',
		level: ''
	});
	const [loading, setLoading] = useState(false);

  const attributeDict = {
    "dark": require('./images/Dark.webp'),
    "divine": require('./images/Divine.webp'),
    "earth": require('./images/Earth.webp'),
    "fire": require('./images/Fire.webp'),
    "light": require('./images/Light.webp'),
    "water": require('./images/Water.png'),
    "wind": require('./images/Wind.webp'),
    "": null,
  }
  const prompts = {
		effect: `Write a YuGiOh effect for a card named "${cardName}"
        Effect:`,
		image: cardName,
		level: `Rate the YuGiOh card\'s strength from 1 to 12 
        YuGiOh card:"${cardName}"
        Strength:`
	};
	const configuration = new Configuration({
		apiKey: `${process.env.REACT_APP_API_KEY}`
	});

  const openai = new OpenAIApi(configuration);

  const generateDetails = async () =>
  {
    console.log("generate");
		setLoading(true);
		let response;

		for (let key in prompts) {
			if (key == 'image') {
				response = await openai.createImage({
					prompt: prompts.image,
					n: 1,
					size: '512x512'
				});
				setResults((prevResults) => ({
					...prevResults,
					image: response.data.data[0].url
				}));
			} else {
				response = await openai.createCompletion({
					model: 'text-davinci-003',
					prompt: prompts[key],
					temperature: 0.6,
					max_tokens: 150,
					top_p: 1,
					frequency_penalty: 1,
					presence_penalty: 1
				});
				setResults((prevResults) => ({
					...prevResults,
					[key]: response.data.choices[0].text
				}));
			}
		}
		setLoading(false);
	};

	const displayResults = () => {
		return Object.keys(results).map((key) => (
			<div>
				{results[key]}
				<br />
				<br />
			</div>
		));
	};

  const createLevelImage = (numlevel) => {

    let levelArray = [];

    for (
      let i = 1;
      i <= numlevel;
      i++
    ) {
      levelArray.push(<img src={level} alt="level image" className='levelIcon'/>)
    }

    return levelArray.map((e) => (e))

  }

  return (
    <div className="page">
      <h1 className="title">Yugioh Card Generator</h1>
      <div className="entry">
        <label>Enter Card Name:</label>
        <input className="monsterName" type="text" onChange={(e) => setCardName(e.target.value)}/>
        <button className='button' onClick={generateDetails}>
					Generate Card
				</button>
      </div>
      <div className="entry">
        <label>Enter Card Level:</label>
        <input className="monsterName" type="text" onChange={(e) => setCardLevel(e.target.value)}/>
        <input type="submit" value="Submit"/>
      </div>
      <div className="entry">
        <label>Enter Card Level:</label>
        <input className="monsterName" type="text" onChange={(e) => setCardLevel(e.target.value)}/>
        <input type="submit" value="Submit"/>
      </div>

      <div className="lcol">
        <div className="yugiohTemplate">
          <div className="nameAndAttribute">
            <div className="yugName">
              {cardName}
            </div>
            {cardAttribute === "" 
            ? null 
            : <img src={attributeDict[cardAttribute]} className="attribute"></img>}
          </div>
		  <div class="level-container">
            {createLevelImage(cardLevel)}
          </div>
		  {results.image === "" 
            ? <div className='cardImage'/> 
            : <img src={results.image} className="cardImage"></img>}
        </div>
		<div style={{backgroundColor: "white"}}>
            {displayResults()}
          </div>
        
        
      </div>
      <img className="yugiImg" 
        src={yugi} 
        alt="Uncle Yugi wants you!"></img>
    </div>
  );
}

export default App;
