// -----------------External APi CTT--------------------
var request= require('request');
var parseString = require('xml2js').parseString;

// GET request for location
var getlocation = (req,res,next)=>{
	if(req.query.CP){
		request('http://www.ctt.pt/pdcp/xml_pdcp?inCodPos=' + req.query.CP,(error, response, body)=> {
			// console.log('error:', error); // Print the error if one occurred
			// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			// console.log('body:', body); // Print the HTML for the Google homepage.
			parseString (body, (err, result) =>{
				if(result.OK){
					if(result.OK.Localidade[0].Designacao[0]._){
						res.status(200).json({message:result.OK.Localidade[0].Designacao[0]._});
					}else{
						res.status(500).json({message:"External API error"});	
					};
				}else if(parseInt(result.Erro.$.total)>0){
					if(result.Erro.Localidade[0].Designacao[0]._){
						res.status(200).json({message:result.Erro.Localidade[0].Designacao[0]._});	
					}else{
						res.status(500).json({message:"External API error"});	
					};
				}else{
					res.status(500).json({message:"External API error"});
				};
			});
		});
	}else{
		res.status(400).json({message:"Bad request"});
	};
};

module.exports = {
	getlocation
}