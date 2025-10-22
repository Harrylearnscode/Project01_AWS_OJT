package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.model.dtos.requests.GHTKShippingFeeRequest;
import Project01.AWS.MealPlan.model.dtos.responses.GHTKShippingFeeResponse;
import Project01.AWS.MealPlan.model.exception.ActionFailedException;
import Project01.AWS.MealPlan.service.GHTKService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Arrays;
import java.util.Collections;

@Service
@Slf4j
public class GHTKServiceImpl implements GHTKService {

    @Value("${ghtk.api.token}")
    private String ghtkToken;

    @Value("${ghtk.api.url.fee}")
    private String ghtkApiUrl;

    private final RestTemplate restTemplate;

    public GHTKServiceImpl() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public GHTKShippingFeeResponse calculateFee(GHTKShippingFeeRequest request) throws Exception {

        //Set up headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghtkToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        //Build URI
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(ghtkApiUrl)
                .queryParam("pick_province", request.getPickProvince())
                .queryParam("pick_district", request.getPickDistrict())
                .queryParam("province", request.getProvince())
                .queryParam("district", request.getDistrict())
                .queryParam("address", request.getAddress())
                .queryParam("weight", request.getWeight())
                .queryParam("value", request.getValue());


        //Create HTTP entity
        HttpEntity<?> entity = new HttpEntity<>(headers);

        // Make the API call
        // GHTK API for calculating fee uses GET method with query parameters
        try {
            ResponseEntity<GHTKShippingFeeResponse> response = restTemplate.exchange(
                    builder.build().encode().toUri(),
                    HttpMethod.GET,
                    entity,
                    GHTKShippingFeeResponse.class);

            // Kiểm tra nếu body rỗng hoặc success=false
            if (response.getBody() == null || !response.getBody().isSuccess()) {
                // Ghi log lại response để debug
                System.err.println("GHTK API call failed with response: " + response.getBody());
                throw new RuntimeException("Failed to calculate shipping fee from GHTK: " + (response.getBody() != null ? response.getBody().getMessage() : "No response body"));
            }

            return response.getBody();
        } catch (RestClientException e) {
            // Nếu có lỗi ở tầng HTTP (ví dụ: 401, 403, 500)
            // Ghi log lại toàn bộ lỗi, bao gồm cả response body của lỗi
            System.err.println("Error calling GHTK API: " + e.getMessage());
            if (e instanceof HttpStatusCodeException) {
                String errorBody = ((HttpStatusCodeException) e).getResponseBodyAsString();
                System.err.println("GHTK Error Body: " + errorBody);
            }
            throw new RuntimeException("Failed to connect to GHTK service.", e);
        }
    }
}
