﻿import { jsPDF } from 'jspdf';
export var font =
var callAddFont = function () {
  this.addFileToVFS('Nikosh-normal.ttf', font);
  this.addFont('Nikosh-normal.ttf', 'Nikosh', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont]);