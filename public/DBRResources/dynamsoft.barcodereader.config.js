/**
 * Dynamsoft JavaScript Library
 * @product Dynamsoft Barcode Reader
 * @website http://www.dynamsoft.com
 *
 * @preserve Copyright 2019, Dynamsoft Corporation
 * @author Dynamsoft
 *
 * @version 6.4.1
 *
 * @fileoverview Dynamsoft JavaScript Library for Dynamsoft Barcode Reader
 * More info on DBR: http://www.dynamsoft.com/Products/Dynamic-Barcode-Reader.aspx
 */

var dynamsoft = self.dynamsoft || {};
dynamsoft.dbrEnv = dynamsoft.dbrEnv || {};

//////////////////////////////////////////////////////////////////////////////

//  WARNING:  The productKey in this file is protected by copyright law    //

//  and international treaty provisions. Unauthorized reproduction or       //

//  distribution of this  productKey, or any portion of it, may result in severe   //

//  criminal and civil penalties, and will be prosecuted to the maximum     //

//  extent possible under the law.  Further, you may not reverse engineer,  //

//  decompile, disassemble, or modify the productKey .                             //

//////////////////////////////////////////////////////////////////////////////
dynamsoft.dbrEnv.productKey = 't0129lQMAAB6+062P8hzP1auyjSlR9SVd7xiHC7gCwBkPtJsZlexYG7WuesMZ5AeLM/8M2GQxHqFMQoH7uryywAOFIxk0tqQvGu6s3JXnO0pzGuY0zGmY0zDTMNMw0zDTMNMwyzDLMMswyzDXu9ZP1GajUd0EqoZ39d+M0YMzdAC+SLXZ;t00966QAAAF6Ccy0/4L+Q5/hQZth9LVKGKHzW6vxf6wP455Lhdokzodq+/BfVWSxy1B+2cdAFwaCLQRxwaJmxDEYm1mY68CMYsfNmjkV+jX6ZFqZ6SUGW4WEyG1Vp5QaukS9I';

// If you want to connect to the service manually, please set it to false
// and call dynamsoft.BarcodeReader.initServiceConnection when needed.
dynamsoft.dbrEnv.bAutoConnectService = true;

/// set resourcesPath in runtime is ok
(function(){
    var p = document.location.protocol;
    if (p !== 'https:' && p !== 'http:')
		dynamsoft.dbrEnv.resourcesPath = "https://demo.dynamsoft.com/JSDemo/DBRResources";
	else
		dynamsoft.dbrEnv.resourcesPath = "DBRResources";
})();


// try 64bit first, default false
//dynamsoft.dbrEnv.ifCheck64bitServiceFirst = true;

// dbr should hide DWAS install dialog
dynamsoft.dbrEnv.hideDWASInstallDialog = true;
// dbr should disable auto download module
dynamsoft.dbrEnv.disableAutoDownloadModule = true;
