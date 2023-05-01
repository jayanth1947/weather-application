public with sharing class weatherAppController {

    // This is used in the lwc component
    // It takes an input parameter which is the name of a city for which weather details are to be retrieved.
    @AuraEnabled
    public static String getWeatherDetails(String input) {

        // The method constructs a URL using the input parameter and a method named getKey to retrieve a unique API key required for accessing the OpenWeatherMap API.
        String url='https://api.openweathermap.org/data/2.5/weather?q=' + input + '&units=metric'+ getKey();

        // then calls a method named getResponse to make an HTTP GET request to the OpenWeatherMap API and retrieve the weather details.
        String response=getResponse(url);

        // Returns the response
        return response;
    }

    // The method getResponse takes a string URL as input parameter.
    public static String getResponse(String strUrl){

        // It creates an instance of the Http class, sets the HTTP method to GET, and sets the endpoint to the input URL.
        Http h = new Http();

        // This code block creates an instance of the HttpRequest class named 'request'.
        HttpRequest request = new HttpRequest();

        // This code block creates an instance of the HttpResponse class named 'response'.
        HttpResponse response = new HttpResponse();

        // This code block sets the HTTP method to GET using the setMethod method of the request instance.
        request.setMethod('GET');

        // This code block sets the endpoint of the request instance to the strUrl parameter using the setEndpoint method.
        request.setEndpoint(strUrl);

        // This code block sets the timeout of the request instance to 120000 milliseconds (2 minutes) using the setTimeout method.
        request.setTimeout(120000);

        // This code block sends the HTTP request to the endpoint URL using the send method of the Http class instance named 'h' and passing in the request instance.
        response=h.send(request);

        // This code block retrieves the response body from the response instance using the getBody method and assigns it to a string variable named responseBody.
        String responseBody=response.getBody();

         // Finally, it returns the response body string.
        return responseBody;

    }

    // The method getKey returns a string value that contains the unique API key required for accessing the OpenWeatherMap API.
    // The API key is hard-coded in this code, but it could be retrieved from a custom setting or a custom metadata record for more secure implementation.
    public static String getKey(){
        String key='e80b1298707b974c079898de10ec7858';
        String output='&appid=' + key;
        return output;
    }
}