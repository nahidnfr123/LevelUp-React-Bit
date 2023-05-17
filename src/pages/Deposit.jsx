import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {ErrorMessage, Field, Form, Formik} from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import {useEffect, useRef} from "react";
import $api from "../services/api.service";
import {FormLabel, Radio, RadioGroup} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid";
import Achievement from "../components/Achievement/Achievement";

export default function Deposit() {
    const isMounted = useRef(false)
    const isLoading = useRef(false)
    const [deposits, setDeposits] = React.useState([])
    const [selectedMethodUuid, setSelectedMethodUuid] = React.useState(null)
    const [selectedMethod, setSelectedMethod] = React.useState(null)
    const [selectedPaymentMethodType, setSelectedPaymentMethodType] = React.useState(null)

    async function init() {
        isLoading.current = true
        const response = await $api.get('/deposit/list')
        setDeposits(response.data)
        isLoading.current = false
    }
    useEffect(  () => {
        if (!isMounted.current) {
            init()
        }
        return () => {
            isMounted.current = true;
        };
    }, [])

    const initialValues = {
        amount: '200',
        trx_no: '',
        photo: '',
        promo_code: '',
        account_no: '1234-3454-6778-3456',
        transaction_hash_id: '',
        user_wallet_name: '',
        user_wallet_id: '',
    }

    const ValidationSchema = Yup.object().shape({
        amount: Yup.string()
            .required('Amount field is required.')
            .min(0, '').max(100000),
    });
    function onMethodChanged (e) {
        setSelectedMethodUuid(e.target.value)

    }
    useEffect(()=>{
        deposits.forEach((deposit) => {
            deposit.details.forEach((detail) => {
                if (detail.uuid === selectedMethodUuid) {
                    setSelectedMethod(detail)
                }
            })
        })
        setSelectedPaymentMethodType(selectedMethod?.paymethod_type)
    }, [deposits, selectedMethodUuid, selectedMethod])
    const handleSubmit = async (values, props) => {
        // console.log(props)
        // event.preventDefault();
        console.log(values)
        const formData = new FormData();
        for (let key in values) {
            if (values[key]) formData.append(key, values[key])
        }
        if(selectedMethod && Object.keys(selectedMethod).length){
            formData.append('deposit_type', selectedPaymentMethodType || '')
            formData.append('uuid', selectedMethod.account_detail[0]?.uuid || '')
        }

        const response = await $api.post('/user/deposit', formData)
        if(response.message === 'success'){

        }
    }


    return (
        <main>
            <Achievement/>
            
        </main>
    );
}
