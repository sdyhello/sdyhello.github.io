#include <urlmon.h>
#pragma comment(lib, "urlmon.lib")

#include <stdio.h>
#include "allA.h"
#include <tchar.h>


char g_storePath [50] = "f:\\work\\StockDownload\\allA\\%s.csv";
int g_stockLength = 3479;

void CharToTchar (const char * _char, TCHAR * tchar)  
{  
    int iLength ;  
  
    iLength = MultiByteToWideChar (CP_ACP, 0, _char, strlen (_char) + 1, NULL, 0) ;  
    MultiByteToWideChar (CP_ACP, 0, _char, strlen (_char) + 1, tchar, iLength) ;  
}

void getPath(char * type, char *stockNum, char *url, TCHAR *TStock)
{
	char stockName [20] = {0};

	sprintf(stockName, type, stockNum);

	char path [54] = {0};
	sprintf(path, url, stockName);

	CharToTchar(path, TStock);
}

void getAssetsTable(char *stockNum)
{
	TCHAR  StockUrl [55] = {0};
	getPath("zcfzb_%s", stockNum, "http://quotes.money.163.com/service/%s.html", StockUrl);

	TCHAR path [54];
	getPath("zcfzb_%s", stockNum, g_storePath, path);
		
	URLDownloadToFile(NULL, StockUrl, path, 0, NULL);
}

void getProfitsTable(char *stockNum)
{
	TCHAR  StockUrl [55] = {0};
	getPath("lrb_%s", stockNum, "http://quotes.money.163.com/service/%s.html", StockUrl);

	TCHAR path [54];
	getPath("lrb_%s", stockNum, g_storePath, path);
		
	URLDownloadToFile(NULL, StockUrl, path, 0, NULL);
}

void getMoneyTable(char *stockNum)
{
	TCHAR  StockUrl [55] = {0};
	getPath("xjllb_%s", stockNum, "http://quotes.money.163.com/service/%s.html", StockUrl);

	TCHAR path [54];
	getPath("xjllb_%s", stockNum, g_storePath, path);
		
	URLDownloadToFile(NULL, StockUrl, path, 0, NULL);
}
void main()
{
	for(int i = 0; i < g_stockLength; i++)
	{
		char *stockName = nameString[i];
		printf("stockCode: %s , count: %d\n", stockName, i + 1);
		char stockNum[7] = {0};
		strncpy(stockNum, stockName + 2, 6);

		getAssetsTable(stockNum);
		getProfitsTable(stockNum);
		getMoneyTable(stockNum);
	}		
}
