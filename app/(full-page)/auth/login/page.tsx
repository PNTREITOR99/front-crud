/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import axios from 'axios';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({
        username: 'jdoe',
        password: 'Jdoe2024'
    });
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleSubmit = async () => {
        try {
            /*  const response = await axios.post('auth/login', {
                username: credentials.username,
                password: credentials.password
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.auth.access_token}`; */
            const token =
                'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNzkyNjE3NiwianRpIjoiZGRmMDA2NzUtNmZkNS00NmVmLWEyNGMtNWI4NWYzOTM1NzRkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJpZCI6MSwidXNlcm5hbWUiOiJqZG9lIiwibmFtZSI6IkpvaG4iLCJsYXN0bmFtZSI6IkRvZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifSwibmJmIjoxNzI3OTI2MTc2LCJjc3JmIjoiNDI1MjQ4ZDktNzY0MS00YTY4LWJjNjctM2NjYzk4OTYyNjg0IiwiZXhwIjoxNzU5NDYyMTc2fQ.jDNl2sBy_qCpOMbyIsECIe7AOvRgOkMFeVwEYUxWujRlu7ody9J6YfRm5K3PkkI6zQZu0QKFs8BP8NVelcefXTCXP2U5AtKxXvPyIxrntyD0ZUYYgPOG9aoNbckcofIO5X55D_xxTwbwn0F0E6llwOQYEJhBwWhgy799Yhe--zKxBOC4p2O4Bd56jkVg6lJIa0teoARhyeHylf_GyRX-7c3HTkntPonMcy8mPOAVlHXweTsBn_JZcsuM5mhQA0bGIarN_ho1hMBhRue39WESYp4KaAHWJJ1Rq7w5qGyCStH4j_lO3kTyN5ws5FDt20O3vlYzCyd0E1fxWOOfJZLlAg';
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            router.push('/products');
            /*   axios.defaults.headers.common[
                'Authorization'
            ] = `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNzkyMjkwOSwianRpIjoiYjQxMDk2NTYtZTk0MS00ODE5LTk2N2QtOTE5MThmMTkyYzI2IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJpZCI6MSwidXNlcm5hbWUiOiJuYWxhdmEiLCJuYW1lIjoiTmljbyIsImxhc3RuYW1lIjoiQWxhdmEiLCJlbWFpbCI6Im5pY29AZXhhbXBsZS5jb20ifSwibmJmIjoxNzI3OTIyOTA5LCJjc3JmIjoiZTAyNGQ1NmYtODc0OS00NDY4LTg4NmQtM2IzZjBkODVmNGIzIiwiZXhwIjoxNzI3OTI2NTA5fQ.ZED393pBhPnKAGtlPbwuQn5bS3r01wKAY6fyBJIBTI3yvwOENXXl0tlQFc7iR6KaJpVTadK3Goi5fynIeMDrI3NfdioRlCyVp2B8gxiUFrl53U_4evO_lr-YyBNgTl7Zm4hjPXo3L0IjsvT-AyTx-1MqTVlnbu-CtWZdQ05pc3NKCgJecd477m_KuuoEEM2r5fVvLVVqAxK8mCxfL4Ma9dWKAPtJ_s1MzAPr06EG1fNd-_OgsyXp4_GF5llVn_GKPPk_d1mleKbtczG3JDcA3WsT7q7HHQQ0bpZlymG2Z4iOcO2s53X8TQW1BisytoLRcCoMYB6A9ni03587un44bg`; */
        } catch (e) {
            alert('Error al iniciar sesión');
            console.log(e);
        }
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenido!</div>
                            <span className="text-600 font-medium">Inicia sesión para continuar</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Usuario
                            </label>
                            <InputText
                                id="email1"
                                type="text"
                                placeholder="usuario"
                                className="w-full md:w-30rem mb-5"
                                style={{ padding: '1rem' }}
                                value={credentials.username}
                                onChange={(e) =>
                                    setCredentials({
                                        ...credentials,
                                        username: e.target.value
                                    })
                                }
                            />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Contraseña
                            </label>
                            <Password
                                inputId="password1"
                                value={credentials.password}
                                onChange={(e) =>
                                    setCredentials({
                                        ...credentials,
                                        password: e.target.value
                                    })
                                }
                                placeholder="Password"
                                toggleMask
                                className="w-full mb-5"
                                inputClassName="w-full p-3 md:w-30rem"
                            ></Password>

                            <Button label="Iniciar Sesión" className="w-full p-3 text-xl" onClick={handleSubmit}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
