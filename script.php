<?php

/**
 * This was used in Laravels Backend
 * to verify ATH movil payment after completed
 */

function athmovil(Request $request)
{
    try { 
        $request->validate([
            'api_token' => 'required',
            'reference_number' => 'required'
        ]);

        $user = ($request->has('user_id'))
                ? $this->userRepository->findWithoutFail($request->get('user_id'))
                : $request->user();

        $client = new Client();
        $reference_number = $request->get('reference_number');
        $athmovil_transaction = "https://www.athmovil.com/rs/v2/transactionStatus";
        
        $response = $client->request('post', $athmovil_transaction, [
            'json' => [
                "publicToken" => setting('ath_movil_api_key'),
                "privateToken" => setting('ath_movil_private_key'),
                "referenceNumber" => $reference_number
            ]
        ]);

        $response = json_decode($response->getBody()->getContents());

        if (isset($response->status) && $response->status == 'completed') {
            $user_id = $user->id;
            $order = $this->createOrder($user_id, 'completed');
            
            if (!empty($order)) {
                return $this->sendResponse([], "Order #$order->id successfully!");
            } else {
                return $this->sendError(["description" => "Something went wrong"]);
            }

        } else {
            return $this->sendError($response);
        }
    } catch (\Exception $e) {
        return $this->sendError($e->getMessage());
    }
}

?>