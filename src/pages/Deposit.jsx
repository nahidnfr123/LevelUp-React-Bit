import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {ErrorMessage, Field, Form, Formik} from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
import $api from "../services/api.service";
import {FormLabel, Radio, RadioGroup} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid";
import AchievementContainer from "../components/Achievement/AchievementContainer";

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

  useEffect(() => {
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

  function onMethodChanged(e) {
    setSelectedMethodUuid(e.target.value)
  }

  useEffect(() => {
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
    if (selectedMethod && Object.keys(selectedMethod).length) {
      formData.append('deposit_type', selectedPaymentMethodType || '')
      formData.append('uuid', selectedMethod.account_detail[0]?.uuid || '')
    }

    const response = await $api.post('/user/deposit', formData)
    if (response.message === 'success') {

    }
  }


  return (
      <main>
       <AchievementContainer/>
        <Box
            sx={{
              pt: 8,
              pb: 6,
            }}
        >
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <RadioGroup
                  name="member"
                  defaultValue=""
                  orientation="horizontal"
                  sx={{gap: 1.5, mt: 1}}
                  onChange={onMethodChanged}
              >
                {deposits && deposits.length && deposits.map((deposit) => (
                    <div key={deposit.name}>
                      <FormLabel>{deposit.name}</FormLabel>
                      <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            '& > :not(style)': {
                              m: 1,
                              width: 90,
                              height: 90,
                            },
                          }}
                      >
                        {(deposit.details && deposit.details.length) ? deposit.details.map((detail) => (
                                <Paper
                                    component="label"
                                    key={detail?.uuid}
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'start',
                                      borderRadius: 'md',
                                      boxShadow: 'sm',
                                      bgcolor: 'background.body',
                                      textAlign: 'center',
                                      p: 0.6,
                                      position: 'relative'
                                    }}
                                    elevation={2}
                                >
                                  <Radio
                                      value={detail?.uuid}
                                      sx={{
                                        mt: -1,
                                        mr: -1,
                                        mb: 0.5,
                                        alignSelf: 'flex-end',
                                        position: 'absolute',
                                        top: 0,
                                        zIndex: 100
                                        // '--Radio-actionRadius': (theme) => theme.vars.radius.md,
                                      }}
                                  />
                                  <Avatar alt={detail?.name} src={detail?.logo} variant="square" sx={{width: 60, height: 60}}/>
                                  {/*<Typography level="body2">{detail?.name}</Typography>*/}
                                </Paper>
                            ))
                            : <div></div>}
                      </Box>
                    </div>
                ))}
              </RadioGroup>

            </Grid>
            {selectedPaymentMethodType && <Grid item xs={5}>
              <h3>
                {selectedMethod?.name}
              </h3>

              <div>
                {selectedPaymentMethodType === 'bank' && <span>
                                <div>account_name: {selectedMethod?.account_detail[0]?.account_name}</div>
                                <div>account_number: {selectedMethod?.account_detail[0]?.account_number}</div>
                            </span>}
                {selectedPaymentMethodType === 'crypto' && <span>
                                <div>wallet_address: {selectedMethod?.account_detail[0]?.wallet_address}</div>
                            </span>}
                {selectedPaymentMethodType === 'digital_wallet' && <span>
                                <div>id_number: {selectedMethod?.account_detail[0]?.id_number}</div>
                                <div>mail: {selectedMethod?.account_detail[0]?.mail}</div>
                            </span>}
                {selectedPaymentMethodType === 'mobile_bank' && <span>
                                <div>mobile_number: {selectedMethod?.account_detail[0]?.mobile_number}</div>
                            </span>}
              </div>
              <Typography
                  component="h1"
                  variant="h2"
                  align="center"
                  color="text.primary"
                  gutterBottom
              >
                <Formik
                    initialValues={initialValues}
                    validationSchema={ValidationSchema}
                    onSubmit={handleSubmit}
                >
                  {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      /* and other goodies */
                    }) => (
                      <Form>
                        {selectedPaymentMethodType === 'bank' && <Field
                            as={TextField}
                            error={!!errors.account_no && touched.account_no}
                            margin="normal"
                            fullWidth
                            id="account_no"
                            label="Account No"
                            name="account_no"
                            autoComplete="account_no"
                            type="text"
                            helperText={<ErrorMessage name='account_no'/>}
                        />}
                        {selectedPaymentMethodType === 'mobile_bank' && <Field
                            as={TextField}
                            error={!!errors.trx_no && touched.trx_no}
                            margin="normal"
                            fullWidth
                            id="trx_no"
                            label="Transaction No"
                            name="trx_no"
                            autoComplete="trx_no"
                            type="text"
                            helperText={<ErrorMessage name='trx_no'/>}
                        />}
                        {selectedPaymentMethodType === 'crypto' && <Field
                            as={TextField}
                            error={!!errors.transaction_hash_id && touched.transaction_hash_id}
                            margin="normal"
                            fullWidth
                            id="transaction_hash_id"
                            label="Transaction Hash Id"
                            name="transaction_hash_id"
                            autoComplete="transaction_hash_id"
                            type="text"
                            helperText={<ErrorMessage name='transaction_hash_id'/>}
                        />}
                        {selectedPaymentMethodType === 'digital_wallet' && <div>
                          <Field
                              as={TextField}
                              error={!!errors.user_wallet_name && touched.user_wallet_name}
                              margin="normal"
                              fullWidth
                              id="user_wallet_name"
                              label="User Wallet Name"
                              name="user_wallet_name"
                              autoComplete="user_wallet_name"
                              type="text"
                              helperText={<ErrorMessage name='user_wallet_name'/>}
                          />
                          <Field
                              as={TextField}
                              error={!!errors.user_wallet_id && touched.user_wallet_id}
                              margin="normal"
                              fullWidth
                              id="user_wallet_id"
                              label="user_wallet_id"
                              name="User Wallet Id"
                              autoComplete="user_wallet_id"
                              type="text"
                              helperText={<ErrorMessage name='user_wallet_id'/>}
                          />
                        </div>}
                        <Field
                            as={TextField}
                            error={!!errors.amount && touched.amount}
                            margin="normal"
                            fullWidth
                            id="amount"
                            label="Amount"
                            name="amount"
                            autoComplete="amount"
                            type="number"
                            helperText={<ErrorMessage name='amount'/>}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            disabled={isSubmitting}
                        >Submit
                        </Button>
                      </Form>
                  )}
                </Formik>
              </Typography>
            </Grid>
            }
          </Grid>
        </Box>
      </main>
  );
}
