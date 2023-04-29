public with sharing class weatherAppController {

    @AuraEnabled
    public static String getWeatherDetails(String input) {
        String url='https://api.openweathermap.org/data/2.5/weather?q=' + input + '&units=metric'+ getKey();
        String response=getResponse(url);
        return response;
    }

    public static String getResponse(String strUrl){
        Http h = new Http();
        HttpRequest request = new HttpRequest();
        HttpResponse response = new HttpResponse();
        request.setMethod('GET');
        request.setEndpoint(strUrl);
        request.setTimeout(120000);
        response=h.send(request);
        String responseBody=response.getBody();
        return responseBody;

    }

    public static String getKey(){
        String key='e80b1298707b974c079898de10ec7858';
        String output='&appid=' + key;
        return output;
    }
}