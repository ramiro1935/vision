new Vue({
	el: 'main',
	data: {
		respuesta: '',
		csv: '',
		count: 0,
	},
	methods: {
		cargarImagen(){
			this.count = 0;
			for(var i = 0; i < 85;){
				this.count = i;
				i = i + 1;
			}
			var formData = new FormData();
			var fileToUpload = event.target.files[0];
			formData.append("file", fileToUpload);
			formData.append("language"   , "spa");
			formData.append("apikey"  , "2331e83a5f88957");
			formData.append("isOverlayRequired", "True");
			this.$http.post('https:/api.ocr.space/parse/image', formData)
			.then((res)=>{
				this.respuesta = res.body.ParsedResults[0].ParsedText;
				this.carga = true;
				this.count = 100;
			}), (err)=>{
				console.log(err);
			};
		},
		generarCsv() {
				this.csv = this.respuesta.split("\r\n");
				let csvContent = "data:text/csv;charset=utf-8,";
				csvContent += 'id,value\r\n';
				let act = '';
				let raiz = this.csv[0];
				let isRoot = true;
				let palabra = (raiz.substr(3, this.csv[0].length - 1)).trim();
				let x = 0;
				let i = 0; //contador para recorrer palabras
				let j = 0; //contador para almacenar/reemplazar prefijos
				let prefix = []; //arreglo de prefijos
				this.csv.forEach((titulo) => {
					titulo = titulo.substr(0,titulo.length-1);
					j = 0;
					for (i = 0; i < titulo.length - 1;) { //recorre palabra
						if (this.isNumber(titulo[i])) {
							j = (i == 0) ? 0 : i / 2; //asigna posicion de prefijo
							if (!this.isNumber(titulo[i + 2])) {
								prefix[j++] = titulo.substr(i + 3, titulo.length-1);
							}
						}
						i = i + 2;
					}
					//construir jerarquias + recorrer prefijos por fila
					act = '';
					for (x = 0; x < j; x++) {
						if (isRoot) { // solo para la raiz
							act = palabra + ',';
							isRoot = false;
						} else {
							//si es el ultimo prefijo se agrega ,
								if (x == j - 1) act += prefix[x] + ',';
								else {
										act += prefix[x] + '.';
									//si es diferente que el root
								}
							}
						}
						csvContent += act + "\r\n";
				});
				var encodedUri = encodeURI(csvContent);
				var link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "flare.csv");
				link.innerHTML = "Click Here to download";
				document.body.appendChild(link); // Required for FF
				link.click();
			},

			isNumber(data) {
				if (data == '0' || data == '1' || data == '2' || data == '3' ||
					data == '4' || data == '5' || data == '6' || data == '7' ||
					data == '8' || data == '9')
					return true;
				else return false;
			}
	}
});
