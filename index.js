var json;

function handleFileSelect(evt) {
	var files = evt.target.files; 
	
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);

document.getElementById("from_date").addEventListener("change", function() {
    sessionStorage.from_date = this.value;
});

document.getElementById("to_date").addEventListener("change", function() {
    sessionStorage.to_date = this.value;
});


function handleFileSelect(evt) {
	var files = evt.target.files; 

	
	for (var i = 0, f; f = files[i]; i++) {
		var reader = new FileReader();

		
		reader.onload = (function (theFile) {
			return function (e) {
				console.log('e readAsText = ', e);
				console.log('e readAsText target = ', e.target);
				try {
					json = JSON.parse(e.target.result);
					var timestamp_location = {}
					var location_activity = {}
					var mid_lat = 0;
					var mid_lon = 0;
					var count = 0;
					for(i = 0; i<json['locations'].length;i++)
					{
						if(sessionStorage.hasOwnProperty("from_date") && sessionStorage.hasOwnProperty("to_date"))
						{
							from_date = new Date(sessionStorage.from_date);
							to_date = new Date(sessionStorage.to_date);
							from_time = from_date.getTime();
							to_time = to_date.getTime();
							if (parseInt(json["locations"][i]['timestampMs'])<from_time || parseInt(json["locations"][i]['timestampMs'])>to_time)
							{
								continue;
							}
						}
						if (json["locations"][i]['latitudeE7']==null || json["locations"][i]['longitudeE7']== null)
						{
							continue;
						}
						count ++;
						mid_lat += json["locations"][i]['latitudeE7']/10000000;
						mid_lon += json["locations"][i]['longitudeE7']/10000000;
						var lat = json["locations"][i]['latitudeE7']/10000000;
						var lon = json["locations"][i]['longitudeE7']/10000000;
						timestamp_location[parseInt(json["locations"][i]['timestampMs'])]=[lat,lon]
						if (json["locations"][i].hasOwnProperty('activity'))
						{
							var key = lat.toFixed(3).toString() + "," + lon.toFixed(3).toString();

							if(!location_activity.hasOwnProperty(key))
							{
								var max_confidence = 0;
								var label = "";
								for (j = 0; j < json['locations'][i]['activity'].length; j++)
								{
									if(json['locations'][i]['activity'][j].hasOwnProperty('activity'))
									{
										for (k = 0; k<json['locations'][i]['activity'][j]['activity'].length;k++)
										{
											if(max_confidence<json['locations'][i]['activity'][j]['activity'][k]["confidence"])
											{
												label = json['locations'][i]['activity'][j]['activity'][k]["type"];
												max_confidence = json['locations'][i]['activity'][j]['activity'][k]["confidence"]
											}
										}
									}
								}
								if(max_confidence > 0)
								{
									location_activity[key] = [label,max_confidence]
								}
							}
							else
							{
								var max_confidence = location_activity[key][1];
								var label = location_activity[key][0];
								for (j = 0; j < json['locations'][i]['activity'].length; j++)
								{
									if(json['locations'][i]['activity'][j].hasOwnProperty('activity'))
									{
										for (k = 0; k<json['locations'][i]['activity'][j]['activity'].length;k++)
										{
											if(max_confidence<json['locations'][i]['activity'][j]['activity'][k]["confidence"])
											{
												label = json['locations'][i]['activity'][j]['activity'][k]["type"];
												max_confidence = json['locations'][i]['activity'][j]['activity'][k]["confidence"]
											}
										}
									}
								}
								if(max_confidence > 0)
								{
									location_activity[key] = [label,max_confidence]
								}
							}

						}

					}
					mid_lon = mid_lon / count;
					mid_lat = mid_lat / count;
					sessionStorage.mid_lon = mid_lon.toString();
					sessionStorage.mid_lat = mid_lat.toString();
					sessionStorage.timestamp_location = JSON.stringify(timestamp_location);
					sessionStorage.location_activity = JSON.stringify(location_activity)
					window.location.href = "map.html";
				} catch (ex) {
					alert('ex when trying to parse json = ' + ex);
				}
			}
		})(f);
		reader.readAsText(f);
	}

}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById("from_date").addEventListener("change", function() {
    sessionStorage.from_date = this.value;
});

document.getElementById("to_date").addEventListener("change", function() {
    sessionStorage.to_date = this.value;
});