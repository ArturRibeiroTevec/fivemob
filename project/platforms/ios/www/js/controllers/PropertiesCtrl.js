'use strict';

FivemobControllers

.controller('PropertiesCtrl', function(API, $state, $scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $ionicPopup) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    // $scope.$parent.setHeaderFab('right');

    /**
     * PROPERTIES ARRAY
     * @type {Array}
     */
    $scope.loading_properties = false;
    $scope.properties = [];
    $scope.page = 1;

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    /**
     * ON CLICK: FAB-PROPERTIES
     * @param  {[type]} )     {                   $scope.openNewPropertieModal();    } [description]
     * @param  {[type]} false [description]
     * @return {[type]}       [description]
     */
    document.getElementById('fab-properties').addEventListener('click', function () {
        $scope.addNewPropertie();
    }, false);

    /**
     * ADD NEW PROPERTIE
     */
    $scope.addNewPropertie = function () {
        $state.go('app.newpropertie');
    };

    /**
     * BEFORE ENTER
     */
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.properties = [];
        $scope.page = 1;
        $scope.loading_properties = true;
        $scope.$evalAsync();

        $scope.showLoading('Carregando imóveis...');

        var getProperties = API.getProperties($scope.page);

        // success
        getProperties.success(function (data) {
            if (data.status === '1') {
                for (var i = 0; i < data.properties.length; i++) {
                    $scope.properties.push(data.properties[i]);
                }

                $scope.hideLoading();
                $scope.loading_properties = false;
                $scope.$evalAsync();
                $scope.page += 1;

                $timeout(function() {
                    ionicMaterialMotion.fadeSlideIn({
                        selector: '.animate-fade-slide-in .item',
                    });
                });
            }
            else {
                $scope.hideLoading();
                $scope.showAlert('Falha', data.message);
            }
        });

        // error
        getProperties.error(function () {
            $scope.hideLoading();
            $scope.loading_properties = false;
            $scope.showDefaultConnectionError();
            $scope.$evalAsync();
        });
    });

    /**
     * DELETE PROPERTIE
     * @return {[type]} [description]
     */
    $scope.deletePropertie = function (index) {
        $ionicPopup.show({
            title: 'Remover',
            template: "Deseja realmente deletar este imóvel?",
            buttons: [
                {
                    text: "Não",
                    onTap: function () {
                        return false;
                    }
                },
                {
                    text: "<strong>Sim</strong>",
                    type: "button-assertive",
                    onTap: function () {
                        return true;
                    }
                }
            ]
        }).then(function (response) {
            if (response) {
                $scope.showLoading('Deletando...');

                var propertie = $scope.properties[index];

                var removePropertie = API.removePropertie(propertie);

                /////////////
                // SUCCESS //
                /////////////
                removePropertie.success(function (data) {
                    if (data.status == '1') {
                        // remove from array
                        $scope.properties.splice(index, 1);
                        document.getElementById('propertie_' + index).style.display = 'none';

                        $scope.hideLoading();
                        $scope.$evalAsync();
                    }
                    else {
                        $scope.hideLoading();
                        $scope.showAlert('Falha', data.message);
                    }
                });

                ///////////
                // ERROR //
                ///////////
                removePropertie.error(function () {
                    $scope.hideLoading();
                    $scope.showDefaultConnectionError();
                });
            }
        });
    };

    /**
     * EDIT PROPERTIE
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    $scope.editPropertie = function (index) {
        Storage.setObject('editPropertie', $scope.properties[index]);
        $state.go('app.newpropertie');
    };
});



/**
 * NEW PROPERTIE
 */
FivemobControllers

.controller('NewPropertieCtrl', function (API, $state, $scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $cordovaActionSheet, $cordovaImagePicker, $cordovaCamera, $window, $ionicPopup) {

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab('right');
    $scope.image_item_size = 'auto';
    $scope.image_item_inner_size = 'auto';

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    /**
     * ON CLICK: FAB-PROPERTIES
     * @param  {[type]} )     {                   $scope.openNewPropertieModal();    } [description]
     * @param  {[type]} false [description]
     * @return {[type]}       [description]
     */
    document.getElementById('fab-new-propertie').addEventListener('click', function () {
        $scope.verifyPropertie();
    }, false);

    /**
     * BEFORE ENTER
     */
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.realtors = [];
        $scope.$evalAsync();

        $scope.showLoading('Carregando corretores...');

        var getRealtors = API.getRealtors();

        // success
        getRealtors.success(function (data) {
            if (data.status === '1') {
                for (var i = 0; i < data.realtors.length; i++) {
                    $scope.realtors.push(data.realtors[i]);
                }

                $scope.hideLoading();
                $scope.$evalAsync();
            }
            else {
                $scope.hideLoading();
                $scope.showAlert('Falha', data.message);
            }
        });

        // error
        getRealtors.error(function () {
            $scope.hideLoading();
            $scope.showDefaultConnectionError();
        });

        // calcule images sizes
        $scope.calculeImagesSizes();

        // init watch fields
        $scope.initWatchFields();
    });

    /**
     * ON WINDOW RESIZE
     * @param  {[type]} ) {             $scope.calculeImagesSizes();    } [description]
     * @return {[type]}   [description]
     */
    angular.element($window).bind('resize', function () {
        // calcule images sizes
        $scope.calculeImagesSizes();
    });

    /**
     * CALCULE IMAGES SIZES
     * @return {[type]} [description]
     */
    $scope.calculeImagesSizes  = function () {
        // calcule image item size
        $scope.image_item_size = ((document.getElementById('newpropertie-content').offsetWidth - 40) / 3);
        $scope.image_item_inner_size = ($scope.image_item_size - 2) + 'px';
        $scope.image_item_size += 'px';

        $scope.$evalAsync();
    };

    /**
     * INIT WATCH FIELDS
     * @return {[type]} [description]
     */
    $scope.initWatchFields = function () {
        for (var state in $scope.newPropertieForm) {
            if (state != 'images' && state != 'realtors') {
                for (var field in $scope.newPropertieForm[state]) {
                    $scope.$watch('newPropertieForm.' + state + '.' + field, function (oldValue, newValue) {
                        // update final description
                        $scope.updateFinalDescription();
                    });
                }
            }
        }
    };

    /**
     * UPDATE FINAL DESCRIPTION
     * @return {[type]} [description]
     */
    $scope.updateFinalDescription = function () {
        // init description
        var description = '';

        // get type name
        for (var i = 0; i < $scope.types.length; i++) {
            if ($scope.types[i].slug == $scope.newPropertieForm.propertie.type) {
                description = $scope.types[i].name;
                break;
            }
        }
        
        // add format
        if ($scope.newPropertieForm.propertie.format != 'comercial' && $scope.newPropertieForm.propertie.format != 'residencial') {
            description += ' disponível para ';
        }
        else {
            description += ' ';
        }
        for (var i = 0; i < $scope.formats.length; i++) {
            if ($scope.formats[i].slug == $scope.newPropertieForm.propertie.format) {
                description += $scope.formats[i].name;
                break;
            }
        }
        description += '.';

        // address
        description += ' Localizado(a) em: ' + $scope.newPropertieForm.propertie.street + ', ' + $scope.newPropertieForm.propertie.number + (($scope.newPropertieForm.propertie.complement) ? ', ' + $scope.newPropertieForm.propertie.complement : '') + ', ' + $scope.newPropertieForm.propertie.neighborhood + ', ' + $scope.newPropertieForm.propertie.city + ', ' + $scope.newPropertieForm.propertie.state + ', ' + $scope.newPropertieForm.propertie.zipcode + '.';

        // m_util and m_total
        description += ' Possui uma metragem útil de ' + (parseFloat($scope.newPropertieForm.propertie.m_util).toFixed(2)) + 'm² e uma metragem total de ' + (parseFloat($scope.newPropertieForm.propertie.m_total).toFixed(2)) + 'm².';

        // intern
        description += ' Possui ' + $scope.newPropertieForm.propertie.bedrooms + ' quarto(s)';

        if (parseInt($scope.newPropertieForm.propertie.rooms) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.rooms + ' sala(s)';
        }

        if (parseInt($scope.newPropertieForm.propertie.kitchens) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.kitchens + ' cozinha(s)';
        }

        if (parseInt($scope.newPropertieForm.propertie.suites) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.suites + ' suíte(s)';
        }

        if (parseInt($scope.newPropertieForm.propertie.vacancies) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.vacancies + ' vaga(s)';
        }

        if (parseInt($scope.newPropertieForm.propertie.washbasins) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.washbasins + ' lavabo(s)';
        }

        if (parseInt($scope.newPropertieForm.propertie.bathrooms) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.bathrooms + ' banheiro(s)';
        }

        if (parseInt($scope.newPropertieForm.propertie.services_areas) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.services_areas + ' área(s) de serviço(s)';
        }

        if (parseInt($scope.newPropertieForm.propertie.housekeepers) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.housekeepers + ' dependência(s) de empregada(s)';
        }

        if (parseInt($scope.newPropertieForm.propertie.offices) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.offices + ' escritório(s)';
        }

        if (parseInt($scope.newPropertieForm.propertie.grills) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.grills + ' churrasqueira(s)';
        }

        if (parseInt($scope.newPropertieForm.propertie.backyards) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.backyards + ' quintal(s)';
        }

        if (parseInt($scope.newPropertieForm.propertie.closets) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.closets + ' closet(s)';
        }

        if (parseInt($scope.newPropertieForm.propertie.furnitures) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.furnitures + ' móvel(s) planejado(s)';
        }

        if (parseInt($scope.newPropertieForm.propertie.edicules) > 0) {
            description += ', ' + $scope.newPropertieForm.propertie.edicules + ' edícula(s)';
        }

        description += '.';

        // near
        var count_near = 0;
        var array_nears = [];
        for (var place in $scope.newPropertieForm.near) {
            if ($scope.newPropertieForm.near[place]) {
                if (count_near == 0) {
                    description += ' Próximo(a) de ';
                }

                switch (place) {
                    case 'subway':
                        array_nears.push('metrô(s)');
                        break;

                    case 'schools':
                        array_nears.push('escola(s)');
                        break;

                    case 'bus_stations':
                        array_nears.push('estação(s) de ônibus');
                        break;

                    case 'hospitals':
                        array_nears.push('hospital(s)');
                        break;

                    case 'markets':
                        array_nears.push('supermercado(s)');
                        break;

                    case 'backeries':
                        array_nears.push('padaria(s)');
                        break;

                    case 'airports':
                        array_nears.push('aeroporto(s)');
                        break;

                    case 'roads':
                        array_nears.push('rodoviária(s)');
                        break;

                    case 'shoppings':
                        array_nears.push('shopping(s)');
                        break;

                    default:
                        break;
                }

                count_near += 1;
            }
        }

        if (count_near > 0) {
            for (var i = 0; i < array_nears.length; i++) {
                if (i == 0) {
                    description += array_nears[i];
                }
                else if (array_nears.length > 1) {
                    if (i == (array_nears.length - 1)) {
                        description += ' e de ' + array_nears[i] + '.';
                    }
                    else {
                        description += ', de ' + array_nears[i];
                    }
                }
            }
            description += '.';
        }

        // condominium
        var array_condominium_attrs_has = [];
        var array_condominium_attrs_be = [];
        for (var attr in $scope.newPropertieForm.condominium) {
            if ($scope.newPropertieForm.condominium[attr] === true  && attr != 'name') {
                switch (attr) {
                    case 'recreation_area':
                        array_condominium_attrs_has.push('área(s) de lazer');
                        break;

                    case 'party_room':
                        array_condominium_attrs_has.push('salão(s) de festas');
                        break;

                    case 'sport_court':
                        array_condominium_attrs_has.push('quadra(s) de esportes');
                        break;

                    case 'gym':
                        array_condominium_attrs_has.push('academia(s)');
                        break;

                    case 'concierge':
                        array_condominium_attrs_has.push('portaria(s)');
                        break;

                    case 'steam_room':
                        array_condominium_attrs_has.push('sauna(s)');
                        break;

                    case 'garden':
                        array_condominium_attrs_has.push('jardim(s)');
                        break;

                    case 'laundry':
                        array_condominium_attrs_has.push('lavanderia(s)');
                        break;

                    case 'balcony':
                        array_condominium_attrs_has.push('sacada(s)');
                        break;

                    case 'pool':
                        array_condominium_attrs_has.push('piscina(s)');
                        break;

                    case 'gourmet':
                        array_condominium_attrs_has.push('terraço(s) gourmet');
                        break;

                    case 'cold_floor':
                        array_condominium_attrs_has.push('piso(s) frio(s)');
                        break;

                    case 'laminate_floor':
                        array_condominium_attrs_has.push('piso(s) laminado(s)');
                        break;

                    case 'porcelain_floor':
                        array_condominium_attrs_has.push('piso(s) de porcelana');
                        break;

                    case 'wood_floor':
                        array_condominium_attrs_has.push('piso(s) de madeira');
                        break;

                    case 'large_airy':
                        array_condominium_attrs_be.push('amplo e arejado');
                        break;

                    case 'great_location':
                        array_condominium_attrs_has.push('ótima localização');
                        break;

                    case 'big_comfy':
                        array_condominium_attrs_has.push('cômodo(s) grande(s)');
                        break;

                    case 'new':
                        array_condominium_attrs_be.push('novo');
                        break;

                    case 'good_lighting':
                        array_condominium_attrs_has.push('boa iluminação');
                        break;

                    default:
                        break;
                }
            }
        }

        if (array_condominium_attrs_has.length > 0) {
            description += ' O condomínio tem ';

            for (var i = 0; i < array_condominium_attrs_has.length; i++) {
                if (i >= 1 && array_condominium_attrs_has.length > 1) {
                    if (i == (array_condominium_attrs_has.length - 1)) {
                        description += ' e ';
                    }
                    else {
                        description += ', ';
                    }
                }

                description += array_condominium_attrs_has[i];
            }
            description += '.';
        }

        if (array_condominium_attrs_be.length > 0) {
            description += ' O condomínio é ';

            for (var i = 0; i < array_condominium_attrs_be.length; i++) {
                if (i >= 1 && array_condominium_attrs_be.length > 1) {
                    if (i == (array_condominium_attrs_be.length - 1)) {
                        description += ' e ';
                    }
                    else {
                        description += ', ';
                    }
                }

                description += array_condominium_attrs_be[i];
            }
            description += '.';
        }

        // rental_value
        if (parseFloat($scope.newPropertieForm.values.rental_value) > 0) {
            description += ' Aluguel disponível por: R$ ' + number_format($scope.newPropertieForm.values.rental_value, 2, ',', '.') + '.';
        }

        // sale_value
        if (parseFloat($scope.newPropertieForm.values.sale_value) > 0) {
            description += ' Venda disponível por: R$ ' + number_format($scope.newPropertieForm.values.sale_value, 2, ',', '.') + '.';
        }

        // iptu_value
        if (parseFloat($scope.newPropertieForm.values.iptu_value) > 0) {
            description += ' Valor do IPTU: R$ ' + number_format($scope.newPropertieForm.values.iptu_value, 2, ',', '.') + '.';
        }

        // final
        $scope.newPropertieForm.propertie.description = description;
    };

    /**
     * FORMATS
     * @type {Array}
     */
    $scope.formats = [
        {
            slug: 'locacao',
            name: 'Locação',
        },
        {
            slug: 'venda',
            name: 'Venda',
        },
        {
            slug: 'comercial',
            name: 'Comercial',
        },
        {
            slug: 'residencial',
            name: 'Residencial',
        },
    ];

    /**
     * TYPES
     * @type {Array}
     */
    $scope.types = [
        {
            slug: 'terrea',
            name: 'Casa Térrea',
        },
        {
            slug: 'sobrado',
            name: 'Sobrado',
        },
        {
            slug: 'apartamento',
            name: 'Apartamento',
        },
        {
            slug: 'sala',
            name: 'Sala Comercial',
        },
        {
            slug: 'galpao',
            name: 'Galpão',
        },
    ];

    /**
     * REALTORS
     * @type {Array}
     */
    $scope.realtors = [];

    /**
     * NEW PROPERTIE FORM
     * @type {Object}
     */
    $scope.newPropertieForm = {
        client: {
            name: '',
            email: '',
            phone: '',
            hide: false,
        },
        images: [],
        realtors: [],
        propertie: {
            title: '',
            description: '',
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipcode: '',
            format: '',
            type: '',
            m_util: '0.00',
            m_total: '0.00',
            bedrooms: 0,
            rooms: 0,
            kitchens: 0,
            bathrooms: 0,
            suites: 0,
            vacancies: 0,
            washbasins: 0,
            services_areas: 0,
            housekeepers: 0,
            offices: 0,
            grills: 0,
            backyards: 0,
            closets: 0,
            furnitures: 0,
            edicules: 0,
        },
        values: {
            rental_value: '0.00',
            sale_value: '0.00',
            iptu_value: '0.00',
        },
        near: {
            subway: false,
            schools: false,
            bus_stations: false,
            hospitals: false,
            markets: false,
            backeries: false,
            airports: false,
            roads: false,
            shoppings: false,
        },
        condominium: {
            name: '',
            recreation_area: false,
            party_room: false,
            sport_court: false,
            gym: false,
            concierge: false,
            steam_room: false,
            garden: false,
            laundry: false,
            balcony: false,
            pool: false,
            gourmet: false,
            cold_floor: false,
            laminate_floor: false,
            porcelain_floor: false,
            wood_floor: false,
            large_airy: false,
            great_location: false,
            big_comfy: false,
            new: false,
            good_lighting: false,
        },
        publish: {
            imovelweb: false,
            olx: false,
            zapimoveis: false,
            vivareal: false,
        },
    };

    // verify edit propertie
    var editPropertie = Storage.getObject('editPropertie', {});
    $scope.id_propertie = '';
    if (getObjectLength(editPropertie) > 0) {
        Storage.setObject('editPropertie', {});
        $scope.newPropertieForm = editPropertie;
        $scope.id_propertie = editPropertie.id_propertie;
        $scope.$evalAsync();
    }
    else {
        $scope.id_propertie = '';
    }

    $scope.required = {
        client: [
            'name',
            'email',
        ],
        propertie: [
            'title',
            'description',
            'street',
            'number',
            'neighborhood',
            'city',
            'state',
            'zipcode',
            'format',
            'type',
            'm_util',
            'm_total',
        ],
        values: [
            'rental_value',
            'sale_value',
            'iptu_value',
        ],
        condominium: [
            'name',
        ],
    };

    /**
     * VERIFY PROPERTIE
     * @return {[type]} [description]
     */
    $scope.verifyPropertie = function () {
        $scope.showLoading('Verificando dados...');

        // 1) verify required fields
        var array_empties = [];
        for (var group in $scope.required) {
            for (var i = 0; i < $scope.required[group].length; i++) {
                var field = $scope.required[group][i];

                // verify if field was fill
                if ($scope.newPropertieForm[group][field] === null || $scope.newPropertieForm[group][field] === '' || !$scope.newPropertieForm[group][field] || $scope.newPropertieForm[group][field] == ' ') {
                    // if not, add name on array empties
                    array_empties.push(group + '-' + field);
                }
            }
        }

        if (array_empties.length > 0) {
            $scope.hideLoading();
            $scope.showAlert('Falha', 'Ops! Por favor, preencha os campos requeridos.');

            for (var i = 0; i < array_empties.length; i++) {
                var className = array_empties[i];
                // console.log('CLASS NAME: ' + className);
                document.querySelector('.field-' + className).className += " danger-input";
            }
        }
        else {
            // OK, SAVE
            $scope.showLoading('Salvando...');
            
            var savePropertie = API.savePropertie($scope.newPropertieForm, $scope.id_propertie);

            /////////////
            // SUCCESS //
            /////////////
            savePropertie.success(function (data) {
                if (data.status == '1') {
                    $scope.hideLoading();
                    $scope.showAlert('<b>Sucesso</b>', 'Imóvel salvo com sucesso!', function () {
                        $state.go('app.properties');

                        $scope.cleanForm();
                    });
                }
                else {
                    $scope.hideLoading();
                    $scope.showAlert('Falha', data.message);
                }
            });

            ///////////
            // ERROR //
            ///////////
            savePropertie.error(function () {
                $scope.hideLoading();
                $scope.showDefaultConnectionError();
            });
        }
    };

    /**
     * SELECT PHOTOS
     * @return {[type]} [description]
     */
    $scope.selectPhotos = function () {
        // Show the action sheet
        var options = {
            title: 'Adicionar Imagem',
            buttonLabels: ['Selecionar da Biblioteca', 'Tirar foto'],
            addCancelButtonWithLabel: 'Cancelar',
            androidEnableCancelButton : true,
            winphoneEnableCancelButton : true,
        };

        $cordovaActionSheet.show(options).then(function(btnIndex) {
            if (btnIndex == 1) {
                // select a picture from library
                $scope.selectLibraryPicture();
            }
            else if(btnIndex == 2) {
                // take a new picture
                $scope.takePicture();
            }
        });
    };

    /**
     * SELECT LIBRARY PICTURE
     */
     $scope.selectLibraryPicture = function () {
        // $scope.showLoading('Carregando...');

        var options = {
            maximumImagesCount: (3 - $scope.newPropertieForm.images.length),
            width: 800,
            height: 800,
            quality: 60,
            outputType: window.imagePicker.OutputType.BASE64_STRING
        };

        $cordovaImagePicker.getPictures(options)
        .then(function (results) {
            // console.log('PICKED IMAGES');
            $scope.hideLoading();
            if (results.length > 0) {
                $scope.showLoading('Verificando...');

                for (var i = 0; i < results.length; i++) {
                    // add to images
                    $scope.newPropertieForm.images.push({
                        base64: results[i],
                    });
                }

                // console.log($scope.newPropertieForm.images);

                $scope.$evalAsync();
                $scope.hideLoading();
            }
        }, function (error) {
            $scope.hideLoading();
            // console.log(error);
            $scope.showAlert('Falha na Imagem', 'Ops! Ocorreu um erro durante a obtenção da imagem. Por favor, tente novamente.');
        });
     };

    /**
     * TAKE PICTURE
     */
    $scope.takePicture = function () {
        // $scope.showLoading('Carregando...');

        var options = {
            quality: 60,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 800,
            targetHeight: 800,
            popoverOptions: CameraPopoverOptions,
            // saveToPhotoAlbum: false,
            saveToPhotoAlbum: true,
            correctOrientation: true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.hideLoading();

            if (imageData && imageData !== null && imageData !== undefined && imageData !== '') {
                $scope.showLoading('Verificando...');

                // add to images
                $scope.newPropertieForm.images.push({
                    base64: imageData,
                });

                // console.log($scope.newPropertieForm.images);

                $scope.$evalAsync();
                $scope.hideLoading();
            }
        }, function(err) {
            $scope.hideLoading();
            $scope.showAlert('Falha na Imagem', 'Ops! Ocorreu um erro durante a obtenção da imagem. Por favor, tente novamente.');
        });

        $cordovaCamera.cleanup();
    };

    /**
     * CLEAN FORM
     * @return {[type]} [description]
     */
    $scope.cleanForm = function () {
        /**
         * NEW PROPERTIE FORM
         * @type {Object}
         */
        $scope.newPropertieForm = {
            client: {
                name: '',
                email: '',
                phone: '',
                hide: false,
            },
            images: [],
            realtors: [],
            propertie: {
                title: '',
                description: '',
                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                zipcode: '',
                format: '',
                type: '',
                m_util: '0.00',
                m_total: '0.00',
                bedrooms: 0,
                rooms: 0,
                kitchens: 0,
                bathrooms: 0,
                suites: 0,
                vacancies: 0,
                washbasins: 0,
                services_areas: 0,
                housekeepers: 0,
                offices: 0,
                grills: 0,
                backyards: 0,
                closets: 0,
                furnitures: 0,
                edicules: 0,
            },
            values: {
                rental_value: '0.00',
                sale_value: '0.00',
                iptu_value: '0.00',
            },
            near: {
                subway: false,
                schools: false,
                bus_stations: false,
                hospitals: false,
                markets: false,
                backeries: false,
                airports: false,
                roads: false,
                shoppings: false,
            },
            condominium: {
                name: '',
                recreation_area: false,
                party_room: false,
                sport_court: false,
                gym: false,
                concierge: false,
                steam_room: false,
                garden: false,
                laundry: false,
                balcony: false,
                pool: false,
                gourmet: false,
                cold_floor: false,
                laminate_floor: false,
                porcelain_floor: false,
                wood_floor: false,
                large_airy: false,
                great_location: false,
                big_comfy: false,
                new: false,
                good_lighting: false,
            },
            publish: {
                imovelweb: false,
                olx: false,
                zapimoveis: false,
                vivareal: false,
            },
        };
    };

    /**
     * DELETE IMAGE
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    $scope.deleteImage = function (index) {
        $ionicPopup.show({
            title: 'Remover',
            template: "Deseja realmente deletar esta imagem?",
            buttons: [
                {
                    text: "Não",
                    onTap: function () {
                        return false;
                    }
                },
                {
                    text: "<strong>Sim</strong>",
                    type: "button-assertive",
                    onTap: function () {
                        return true;
                    }
                }
            ]
        }).then(function (response) {
            if (response) {
                $scope.showLoading('Deletando...');

                // remove from array
                $scope.newPropertieForm.images.splice(index, 1);

                $scope.hideLoading();
                $scope.$evalAsync();
            }
        });
    };
});