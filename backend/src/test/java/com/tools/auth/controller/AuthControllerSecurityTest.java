package com.tools.auth.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.tools.auth.dto.MessageResponse;
import com.tools.auth.service.AuthService;
import com.tools.auth.service.EmailActivationService;
import com.tools.auth.service.PasswordResetService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private PasswordResetService passwordResetService;

    @MockBean
    private EmailActivationService emailActivationService;

    @Test
    void verifyEmailEndpoint_isPublic() throws Exception {
        when(emailActivationService.verifyToken("057499e9-6c40-406e-84b2-862b695871c9"))
            .thenReturn(new MessageResponse("邮箱激活成功。"));

        mockMvc.perform(get("/api/v1/auth/verify-email")
                .param("token", "057499e9-6c40-406e-84b2-862b695871c9"))
            .andExpect(status().isOk());

        verify(emailActivationService).verifyToken("057499e9-6c40-406e-84b2-862b695871c9");
    }
}
